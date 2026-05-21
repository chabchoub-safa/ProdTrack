import { useCallback, useEffect, useMemo, useState } from "react";
import { Client } from "@stomp/stompjs";
import {
  connectWaterSocket,
  getWaterHistoryByRange,
  PeriodType,
  WaterMeasurement,
} from "../services/water.service";

function formatLocalDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getRange(period: PeriodType, customStart?: string, customEnd?: string) {
  const now = new Date();

  if (period === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return {
      start: formatLocalDateTime(start),
      end: formatLocalDateTime(now),
    };
  }

  if (period === "7d") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return {
      start: formatLocalDateTime(start),
      end: formatLocalDateTime(now),
    };
  }

  if (period === "30d") {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return {
      start: formatLocalDateTime(start),
      end: formatLocalDateTime(now),
    };
  }

  return {
    start: customStart || formatLocalDateTime(new Date(now.getTime() - 7 * 24 * 3600 * 1000)),
    end: customEnd || formatLocalDateTime(now),
  };
}

export function useWaterDashboard(selectedMachine: string = "ALL") {
  const [period, setPeriod] = useState<PeriodType>("today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [history, setHistory] = useState<WaterMeasurement[]>([]);
  const [latest, setLatest] = useState<WaterMeasurement | null>(null);
  const [loading, setLoading] = useState(false);
  const [connected, setConnected] = useState(false);

  const loadData = useCallback(async () => {
    const range = getRange(period, customStart, customEnd);
    setLoading(true);

    try {
const data = await getWaterHistoryByRange(
  range.start,
  range.end,
  selectedMachine
);      const ordered = [...data].sort(
        (a, b) =>
          new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
      );

      setHistory(ordered);
      setLatest(ordered.length ? ordered[ordered.length - 1] : null);

      if (period === "today") {
        localStorage.setItem("water_today_cache", JSON.stringify(ordered));
      }
    } catch (err) {
      console.error(err);

      if (period === "today") {
        const cached = localStorage.getItem("water_today_cache");
        if (cached) {
          const parsed: WaterMeasurement[] = JSON.parse(cached);
          setHistory(parsed);
          setLatest(parsed.length ? parsed[parsed.length - 1] : null);
        }
      }
    } finally {
      setLoading(false);
    }
}, [period, customStart, customEnd, selectedMachine]);
  useEffect(() => {
    loadData();
  }, [loadData]);

  useEffect(() => {
    let stompClient: Client | null = null;

    stompClient = connectWaterSocket(
      (newData) => {
        setConnected(true);

        setLatest(newData);

        setHistory((prev) => {
          const updated = [...prev, newData].sort(
            (a, b) =>
              new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
          );

          if (period === "today") {
            localStorage.setItem("water_today_cache", JSON.stringify(updated));
          }

          return updated;
        });
      },
      (state) => setConnected(state)
    );

    return () => {
      stompClient?.deactivate();
    };
  }, [period]);

  const stats = useMemo(() => {
    if (!history.length) {
      return {
        totalConsumption: 0,
        avgFlow: 0,
        peakFlow: 0,
        count: 0,
      };
    }

    const flows = history.map((x) => Number(x.flowLMin ?? 0));
    const peakFlow = Math.max(...flows);
    const avgFlow = flows.reduce((a, b) => a + b, 0) / flows.length;

    const firstTotal = Number(history[0]?.totalLiters ?? 0);
    const lastTotal = Number(history[history.length - 1]?.totalLiters ?? 0);

    return {
      totalConsumption: Math.max(0, lastTotal - firstTotal),
      avgFlow,
      peakFlow,
      count: history.length,
    };
  }, [history]);

  const chartData = useMemo(() => {
    return history.map((item) => ({
      time:
        period === "today"
          ? new Date(item.receivedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : new Date(item.receivedAt).toLocaleDateString("fr-FR", {
              day: "2-digit",
              month: "2-digit",
            }),
      flow: Number(item.flowLMin ?? 0),
      total: Number(item.totalLiters ?? 0),
      pulse: Number(item.pulseCount ?? 0),
      rawDate: item.receivedAt,
    }));
  }, [history, period]);

  return {
    period,
    setPeriod,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    history,
    latest,
    loading,
    connected,
    stats,
    chartData,
    reload: loadData,
  };
}