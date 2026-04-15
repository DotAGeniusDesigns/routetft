const express = require('express')
const cors = require('cors')
const fs = require('fs')
const path = require('path')

const app = express()
const PORT = 3001

app.use(cors())
app.use(express.json())

// --- File paths ---
const AUGMENTS_FILE = path.join(__dirname, 'src/data/augments.ts')
const COMPS_FILE = path.join(__dirname, 'src/data/metaComps.ts')

// --- Parse .ts data files ---

function parseAugments() {
  const raw = fs.readFileSync(AUGMENTS_FILE, 'utf8')
  const start = raw.indexOf('= [') + 2  // skip past '= ' to get to '['
  const end = raw.lastIndexOf(']') + 1
  return JSON.parse(raw.slice(start, end))
}

function parseComps() {
  const raw = fs.readFileSync(COMPS_FILE, 'utf8')
  // Strip TS import and type annotation, eval the array
  const stripped = raw
    .replace(/^import.*\n/gm, '')
    .replace(/export const META_COMPS:\s*MetaComp\[\]\s*=/, 'module.exports =')
  const mod = { exports: {} }
  new Function('module', stripped)(mod)
  return mod.exports
}

// --- Write back to .ts files ---

function writeAugments(data) {
  const content =
    `import { TFTAugment } from "../types/tft"\n\n` +
    `export const AUGMENTS: TFTAugment[] = ` +
    JSON.stringify(data, null, 2) +
    `\n`
  fs.writeFileSync(AUGMENTS_FILE, content, 'utf8')
}

const REMOVED_COMP_FIELDS = ['mainTrait']

function writeComps(data) {
  const cleaned = data.map(comp => {
    const c = { ...comp }
    REMOVED_COMP_FIELDS.forEach(f => delete c[f])
    return c
  })
  const content =
    `import { MetaComp } from '../types/tft'\n\n` +
    `export const META_COMPS: MetaComp[] = ` +
    JSON.stringify(cleaned, null, 2) +
    `\n`
  fs.writeFileSync(COMPS_FILE, content, 'utf8')
}

// --- In-memory state (seeded from files on startup) ---
let augments = []
let comps = []

try {
  augments = parseAugments()
  console.log(`Loaded ${augments.length} augments`)
} catch (e) {
  console.error('Failed to parse augments.ts:', e.message)
}

try {
  comps = parseComps()
  console.log(`Loaded ${comps.length} meta comps`)
} catch (e) {
  console.error('Failed to parse metaComps.ts:', e.message)
}

// --- Augment routes ---

app.get('/api/augments', (req, res) => {
  res.json({ ok: true, data: augments })
})

app.post('/api/augments', (req, res) => {
  const aug = req.body
  if (!aug.id || !aug.name) return res.status(400).json({ ok: false, error: 'id and name required' })
  augments.push(aug)
  writeAugments(augments)
  res.json({ ok: true, data: augments })
})

app.put('/api/augments/:id', (req, res) => {
  const idx = augments.findIndex(a => a.id === req.params.id)
  if (idx === -1) return res.status(404).json({ ok: false, error: 'not found' })
  augments[idx] = { ...augments[idx], ...req.body }
  writeAugments(augments)
  res.json({ ok: true, data: augments[idx] })
})

app.delete('/api/augments/:id', (req, res) => {
  const before = augments.length
  augments = augments.filter(a => a.id !== req.params.id)
  if (augments.length === before) return res.status(404).json({ ok: false, error: 'not found' })
  writeAugments(augments)
  res.json({ ok: true, data: augments })
})

// --- Meta comp routes ---

app.get('/api/comps', (req, res) => {
  res.json({ ok: true, data: comps })
})

app.post('/api/comps', (req, res) => {
  const comp = req.body
  if (!comp.id || !comp.name) return res.status(400).json({ ok: false, error: 'id and name required' })
  comps.push(comp)
  writeComps(comps)
  res.json({ ok: true, data: comps })
})

app.put('/api/comps/:id', (req, res) => {
  const idx = comps.findIndex(c => c.id === req.params.id)
  if (idx === -1) return res.status(404).json({ ok: false, error: 'not found' })
  comps[idx] = { ...comps[idx], ...req.body }
  writeComps(comps)
  res.json({ ok: true, data: comps[idx] })
})

app.delete('/api/comps/:id', (req, res) => {
  const before = comps.length
  comps = comps.filter(c => c.id !== req.params.id)
  if (comps.length === before) return res.status(404).json({ ok: false, error: 'not found' })
  writeComps(comps)
  res.json({ ok: true, data: comps })
})

app.listen(PORT, () => {
  console.log(`Admin server running at http://localhost:${PORT}`)
  console.log(`Open the admin panel at http://localhost:3000?admin=true`)
})
