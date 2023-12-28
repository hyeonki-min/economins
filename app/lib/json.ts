'use server';
import { promises as fs } from 'fs';

export interface Rate {
    rate: number[]
    rate1: number[]
    rate2: number[]
    rate3: number[]
    rate4: number[]
    rate5: number[]
    rate6: number[]
    rate7: number[]
    date: string[]
  }

export async function getChartData() { 
    const file = await fs.readFile(process.cwd() + '/app/data.json', 'utf8');
    const rate: Rate = JSON.parse(file);
    return rate;
}