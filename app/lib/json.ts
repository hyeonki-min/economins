'use server';
import { promises as fs } from 'fs';

interface IObjectKeys {
  [key: string]: Coordinates[];
}

export interface Coordinates {
  x: string,
  y: number
}

export interface Rate extends IObjectKeys{
    rate: Coordinates[]
}

export async function getChartData() { 
    const file = await fs.readFile(process.cwd() + '/app/data.json', 'utf8');
    const rate: Rate = JSON.parse(file);
    return rate;
}