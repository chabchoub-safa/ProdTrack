import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // appId: 'io.ionic.starter',
  // appName: 'PFE',
  // webDir: 'dist'
  appId: 'com.cettex.pfe',
  appName: 'CETTEX',
  webDir: 'dist',
  server: {
    androidScheme: 'http',   // ✅ HTTP au lieu de HTTPS
    cleartext: true  
  }
};

export default config;



