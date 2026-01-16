import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const OTP_FILE = join(process.cwd(), 'otp-store.json');

function loadStore() {
  if (existsSync(OTP_FILE)) {
    const data = JSON.parse(readFileSync(OTP_FILE, 'utf-8'));
    return new Map(Object.entries(data));
  }
  return new Map();
}

function saveStore(store: Map<any, any>) {
  const obj = Object.fromEntries(store);
  writeFileSync(OTP_FILE, JSON.stringify(obj));
}

export const otpStore = loadStore();

export function setOtp(email: string, data: any) {
  otpStore.set(email, data);
  saveStore(otpStore);
}

export function getOtp(email: string) {
  return otpStore.get(email);
}

export function deleteOtp(email: string) {
  otpStore.delete(email);
  saveStore(otpStore);
}
