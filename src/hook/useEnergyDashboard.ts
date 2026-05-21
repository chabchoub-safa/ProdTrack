import { useCallback, useEffect, useMemo, useState } from "react";
import { Client } from "@stomp/stompjs";
import {
  connectEnergySocket,
  EnergyMeasurement,
  getEnergyHistoryByRange,
} from "../services/energy.service";

type PeriodType = "today" | "7d" | "30d" | "custom"| "prediction";

function formatLocalDateTime(date: Date) {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

function getRange(period: PeriodType, customStart?: string, customEnd?: string) {
  const now = new Date();

  if (period === "today") {
    const start = new Date();
    start.setHours(0, 0, 0, 0);
    return { start: formatLocalDateTime(start), end: formatLocalDateTime(now) };
  }

  if (period === "7d") {
    const start = new Date();
    start.setDate(start.getDate() - 7);
    return { start: formatLocalDateTime(start), end: formatLocalDateTime(now) };
  }

  if (period === "30d") {
    const start = new Date();
    start.setDate(start.getDate() - 30);
    return { start: formatLocalDateTime(start), end: formatLocalDateTime(now) };
  }

  return {
    start: customStart || formatLocalDateTime(new Date(now.getTime() - 7 * 24 * 3600 * 1000)),
    end: customEnd || formatLocalDateTime(now),
  };
}

export function useEnergyDashboard(selectedMachine: string = "ALL") {  const [period, setPeriod] = useState<PeriodType>("today");
  const [customStart, setCustomStart] = useState("");
  const [customEnd, setCustomEnd] = useState("");
  const [history, setHistory] = useState<EnergyMeasurement[]>([]);
  const [latest, setLatest] = useState<EnergyMeasurement | null>(null);
  const [connected, setConnected] = useState(false);

  const loadData = useCallback(async () => {
    const range = getRange(period, customStart, customEnd);
const data = await getEnergyHistoryByRange(
  range.start,
  range.end,
  selectedMachine
);    const ordered = [...data].sort(
      (a, b) => new Date(a.receivedAt).getTime() - new Date(b.receivedAt).getTime()
    );
    setHistory(ordered);
    setLatest(ordered.length ? ordered[ordered.length - 1] : null);
}, [period, customStart, customEnd, selectedMachine]);
  useEffect(() => {
    loadData().catch(console.error);
  }, [loadData]);

  useEffect(() => {
    let stompClient: Client | null = null;

    stompClient = connectEnergySocket(
      (newData) => {
        setLatest(newData);
        setHistory((prev) => [...prev.slice(-299), newData]);
      },
      (state) => setConnected(state)
    );

    return () => {
      stompClient?.deactivate();
    };
  }, []);

  const stats = useMemo(() => {
    if (!history.length) {
      return {
        totalConsumption: 0,
        avgPower: 0,
        peakPower: 0,
        avgVoltage: 0,
        avgCurrent: 0,
      };
    }

    const powers = history.map((x) => x.power ?? 0);
    const voltages = history.map((x) => x.voltage ?? 0);
    const currents = history.map((x) => x.current ?? 0);

    const firstEnergy = history[0]?.energy ?? 0;
    const lastEnergy = history[history.length - 1]?.energy ?? 0;

    return {
      totalConsumption: Math.max(0, lastEnergy - firstEnergy),
      avgPower: powers.reduce((a, b) => a + b, 0) / powers.length,
      peakPower: Math.max(...powers),
      avgVoltage: voltages.reduce((a, b) => a + b, 0) / voltages.length,
      avgCurrent: currents.reduce((a, b) => a + b, 0) / currents.length,
    };
  }, [history]);

  const chartData = useMemo(() => {
    return history.map((item) => ({
      time:
        period === "today"
          ? new Date(item.receivedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : new Date(item.receivedAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "2-digit" }),
      power: Number(item.power ?? 0),
      energy: Number(item.energy ?? 0),
      current: Number(item.current ?? 0),
      voltage: Number(item.voltage ?? 0),
    }));
  }, [history, period]);

  return {
    period,
    setPeriod,
    customStart,
    setCustomStart,
    customEnd,
    setCustomEnd,
    latest,
    connected,
    stats,
    chartData,
    reload: loadData,
  };
}