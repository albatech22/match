# Déploiement Rapide - Repo Public

## 📤 Étape 1 : Pousser sur GitHub (PowerShell)

```powershell
cd "C:\Users\UnlockCD Group\Pictures\match"

# Ajouter le remote (si pas déjà fait)
git remote add origin https://github.com/albatech22/match.git

# Ajouter tous les fichiers
git add .

# Créer le commit
git commit -m "Initial commit - Match streaming app"

# Renommer la branche
git branch -M main

# Pousser sur GitHub
git push -u origin main
```

**Si vous avez déjà un commit**, utilisez simplement :
```powershell
git push -u origin main
```

---

## 🚀 Étape 2 : Déployer sur VPS (Terminal Lightsail)

### Connexion au VPS
1. Allez sur https://lightsail.aws.amazon.com/
2. Cliquez sur votre instance
3. Cliquez "Connect using SSH"

### Commandes de Déploiement

Copiez-collez **tout ce bloc** dans le terminal :

```bash
# Charger Node.js
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
nvm use 18

# Cloner le repo (repo public, pas d'auth nécessaire)
git clone https://github.com/albatech22/match.git ~/match

# Aller dans le dossier
cd ~/match

# Installer les dépendances
npm install

# Builder l'application
npm run build

# Démarrer avec PM2
pm2 start npm --name "match" -- start

# Sauvegarder la config PM2
pm2 save

# Configurer le démarrage auto
pm2 startup
```

Après la dernière commande, **copiez et exécutez** la commande qui s'affiche.

---

## 🌐 Accéder à l'Application

Ouvrez votre navigateur : **http://54.210.78.21:3000**

---

## 🔄 Mises à Jour Futures

### Sur votre PC (après modifications)
```powershell
git add .
git commit -m "Description des changements"
git push
```

### Sur le VPS (pour déployer)
```bash
cd ~/match
git pull
npm install
npm run build
pm2 restart match
```

---

## 📊 Commandes Utiles

```bash
# Voir les logs en temps réel
pm2 logs match

# Voir le statut
pm2 status

# Redémarrer
pm2 restart match

# Arrêter
pm2 stop match
```
