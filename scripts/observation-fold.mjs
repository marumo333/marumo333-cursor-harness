#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { foldObservations } from './lib/observation-fold.mjs';

const raw = readFileSync(0, 'utf8');
const items = JSON.parse(raw || '[]');
const folded = foldObservations(items);
process.stdout.write(`${JSON.stringify(folded)}\n`);
