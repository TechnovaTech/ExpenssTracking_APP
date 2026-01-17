import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';

const OTP_FILE = join(process.cwd(), 'otp-store.json');

function loadStore() {
  try {
    if (existsSync(OTP_FILE)) {
      const data = JSON.parse(readFileSync(OTP_FILE, 'utf-8'));
      const store = new Map();
      Object.entries(data).forEach(([key, value]) => {
        store.set(key, value);
      });
      return store;
    }
  } catch (error) {
    console.error('Error loading OTP store:', error);
  }
  return new Map();
}

function saveStore(store: Map<any, any>) {
  try {
    const obj: any = {};
    store.forEach((value, key) => {
      obj[key] = value;
    });
    writeFileSync(OTP_FILE, JSON.stringify(obj, null, 2));
    console.log('OTP store saved to file');
  } catch (error) {
    console.error('Error saving OTP store:', error);
  }
}

export const otpStore = loadStore();

export function setOtp(email: string, data: any) {
  otpStore.set(email, data);
  saveStore(otpStore);
  console.log(`OTP stored for ${email}:`, data);
}

export function getOtp(email: string) {
  const data = otpStore.get(email);
  console.log(`Getting OTP for ${email}:`, data);
  return data;
}

export function deleteOtp(email: string) {
  otpStore.delete(email);
  saveStore(otpStore);
  console.log(`OTP deleted for ${email}`);
}
