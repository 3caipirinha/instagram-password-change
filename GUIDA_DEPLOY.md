# 🚀 Guida Completa: Deploy su Vercel con Vercel KV

## 📋 Prerequisiti
- Node.js installato (versione 18+)
- Un account GitHub (gratuito)
- Un account Vercel (gratuito)

---

## STEP 1: Preparazione del Progetto Locale

### 1.1 Installa le dipendenze
Apri il terminale nella cartella del progetto `app` ed esegui:

```bash
npm install
```

Questo installerà tutte le dipendenze necessarie, incluso `@vercel/kv`.

### 1.2 Testa in locale (opzionale)
Per verificare che tutto funzioni:

```bash
npm run dev
```

Apri http://localhost:5173 nel browser. Vedrai la pagina del cambio password.
**NOTA:** La funzionalità di salvataggio NON funzionerà in locale, solo dopo il deploy su Vercel.

---

## STEP 2: Configurazione GitHub

### 2.1 Crea un account GitHub
1. Vai su https://github.com
2. Clicca "Sign up" (Registrati)
3. Segui la procedura guidata
4. Verifica la tua email

### 2.2 Crea un nuovo repository
1. Una volta loggato, clicca il pulsante "+" in alto a destra
2. Seleziona "New repository"
3. Compila i campi:
   - **Repository name**: `instagram-password-change` (o il nome che preferisci)
   - **Description**: "Pagina cambio password Instagram"
   - **Public/Private**: Scegli "Public" (gratuito) o "Private"
   - **NON** selezionare "Add a README file"
   - **NON** selezionare "Add .gitignore"
4. Clicca "Create repository"

### 2.3 Carica il codice su GitHub
Nella cartella `app`, esegui questi comandi nel terminale:

```bash
# Inizializza Git
git init

# Aggiungi tutti i file
git add .

# Crea il primo commit
git commit -m "Initial commit - Instagram password change page"

# Collega il repository remoto (sostituisci TUO-USERNAME con il tuo username GitHub)
git remote add origin https://github.com/TUO-USERNAME/instagram-password-change.git

# Pusha il codice
git branch -M main
git push -u origin main
```

**Se ti chiede username e password:**
- Username: il tuo username GitHub
- Password: usa un **Personal Access Token** invece della password (vedi sotto)

#### Come creare un Personal Access Token:
1. Vai su GitHub → Settings (icona profilo in alto a destra)
2. Scorri in fondo → Developer settings
3. Personal access tokens → Tokens (classic)
4. "Generate new token" → "Generate new token (classic)"
5. Dai un nome (es. "Vercel Deploy")
6. Seleziona lo scope "repo"
7. Clicca "Generate token"
8. **COPIA IL TOKEN** (non lo vedrai più!)
9. Usalo come password quando Git te lo chiede

---

## STEP 3: Configurazione Vercel

### 3.1 Crea account Vercel
1. Vai su https://vercel.com
2. Clicca "Sign Up"
3. **Importante**: Scegli "Continue with GitHub"
4. Autorizza Vercel ad accedere al tuo GitHub

### 3.2 Importa il progetto da GitHub
1. Nella dashboard Vercel, clicca "Add New..." → "Project"
2. Vedrai la lista dei tuoi repository GitHub
3. Cerca `instagram-password-change` (o il nome che hai usato)
4. Clicca "Import" accanto al repository

### 3.3 Configura il progetto
Vercel rileverà automaticamente che è un progetto Vite. Verifica che:

- **Framework Preset**: Vite
- **Root Directory**: `app` (se il codice è nella cartella app)
- **Build Command**: `npm run build`
- **Output Directory**: `dist`

Clicca "Deploy" (NON configurare ancora le variabili d'ambiente, lo faremo dopo)

**Il primo deploy fallirà** - è normale! Dobbiamo configurare Vercel KV.

---

## STEP 4: Configurazione Vercel KV (Database Redis)

### 4.1 Crea database KV
1. Nella dashboard del progetto Vercel, vai alla tab "Storage"
2. Clicca "Create Database"
3. Seleziona "KV" (Redis)
4. Scegli:
   - **Database Name**: `password-logs` (o qualsiasi nome)
   - **Region**: Scegli la regione più vicina a te
5. Clicca "Create"

### 4.2 Collega il database al progetto
1. Dopo aver creato il database, clicca su di esso
2. Vai alla tab "Settings" del database
3. Nella sezione "Connect to Projects", clicca "Connect Project"
4. Seleziona il tuo progetto (`instagram-password-change`)
5. Scegli l'environment: **Production** e **Preview** (seleziona entrambi)
6. Clicca "Connect"

Vercel aggiungerà automaticamente le variabili d'ambiente necessarie al progetto!

---

## STEP 5: Re-deploy del Progetto

### 5.1 Triggera un nuovo deploy
1. Vai alla tab "Deployments" del tuo progetto
2. Clicca sui tre puntini del deployment più recente
3. Seleziona "Redeploy"
4. Conferma con "Redeploy"

Oppure:

1. Fai una modifica minima al codice in locale (es. aggiungi uno spazio)
2. Esegui:
   ```bash
   git add .
   git commit -m "Trigger redeploy"
   git push
   ```

### 5.2 Verifica il deployment
Dopo qualche minuto, il deploy sarà completo!
Clicca sul link del tuo sito (es. `instagram-password-change.vercel.app`)

---

## ✅ TESTING

### Test 1: Cambio Password
1. Apri il tuo sito
2. Compila tutti e 3 i campi password
3. Clicca "Cambia password"
4. Dovresti vedere il messaggio verde di conferma in alto a destra!

### Test 2: Verifica i log salvati
Per vedere i dati salvati, vai a:
```
https://tuo-sito.vercel.app/api/get-logs
```

Vedrai un JSON con i log di tutti i cambi password:
```json
{
  "logs": [
    {
      "id": "password-change:1707667890123",
      "timestamp": "2024-02-11T15:30:00.000Z",
      "passwordLength": {
        "current": 8,
        "new": 12
      },
      "ip": "123.456.789.0",
      "userAgent": "Mozilla/5.0..."
    }
  ],
  "total": 1
}
```

---

## 📊 Cosa viene salvato?

Per **sicurezza**, NON salviamo le password in chiaro! Salviamo solo:

- ✅ **Timestamp**: quando è stato fatto il cambio
- ✅ **Lunghezza password**: quanti caratteri aveva la vecchia e la nuova
- ✅ **IP address**: da dove è stata fatta la richiesta
- ✅ **User Agent**: che browser/dispositivo è stato usato

---

## 🎯 Comandi Utili

### Push di nuove modifiche:
```bash
git add .
git commit -m "Descrizione delle modifiche"
git push
```

### Vedere i log in tempo reale su Vercel:
1. Dashboard Vercel → tuo progetto
2. Tab "Deployments" → clicca sull'ultimo deployment
3. Tab "Functions" → vedrai le chiamate API in tempo reale

---

## 🔒 Note sulla Sicurezza

1. **Password NON salvate in chiaro**: Il codice è configurato per NON inviare mai le password all'API
2. **HTTPS automatico**: Vercel usa HTTPS di default
3. **Database protetto**: Solo la tua app Vercel può accedere al database KV

---

## 🆘 Troubleshooting

### Errore "Method not allowed"
- Verifica che l'API sia accessibile su `/api/log-password-change`
- Controlla i log su Vercel Dashboard

### Database non connesso
- Vai su Storage → password-logs → Settings → Connect to Projects
- Assicurati che il progetto sia collegato

### Deploy fallito
- Controlla i log del build nella tab Deployments
- Verifica che `@vercel/kv` sia in `package.json`

---

## 📚 Risorse

- [Documentazione Vercel](https://vercel.com/docs)
- [Vercel KV Docs](https://vercel.com/docs/storage/vercel-kv)
- [GitHub Docs](https://docs.github.com)

---

## 🎉 Fatto!

Il tuo progetto è online e funzionante! Ogni cambio password verrà registrato automaticamente nel database Vercel KV.

**URL del tuo sito**: https://tuo-progetto.vercel.app
**API logs**: https://tuo-progetto.vercel.app/api/get-logs
