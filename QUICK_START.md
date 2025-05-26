# 🚀 **Démarrage Rapide - Système de Détection de Langage des Signes**

## ⚡ **Démarrage Manuel (Recommandé)**

### **Étape 1 : Ouvrir 2 Terminaux**

#### **Terminal 1 - Backend Django**
```bash
cd sign_language_detection
python manage.py runserver 8000
```

#### **Terminal 2 - Frontend Next.js**
```bash
cd sign-language-tool
npm run dev
```

### **Étape 2 : Vérifier le Statut**
```bash
node test_servers.js
```

### **Étape 3 : Ouvrir l'Application**
- **Interface Web :** `http://localhost:3000`
- **API Backend :** `http://localhost:8000`

---

## 🎯 **Utilisation**

1. **Autorisez l'accès caméra** quand demandé
2. **Cliquez "Start Detection"**
3. **Positionnez votre main** devant la caméra
4. **Formez des lettres** en langage des signes
5. **Observez la détection** en temps réel

---

## 🔧 **Version Actuelle**

**Mode Simplifié Activé** ✅
- ✅ Interface Next.js fonctionnelle
- ✅ API Django simplifiée
- ✅ Détection mock pour tests
- ⚠️ TensorFlow non installé (prédictions simulées)

---

## 📊 **Fonctionnalités Disponibles**

### **Interface Principale**
- ✅ Caméra en direct
- ✅ Dashboard métriques
- ✅ Indicateurs de statut
- ✅ Contrôles de détection

### **API Backend**
- ✅ `/api/health/` - Vérification santé
- ✅ `/api/detect-sign/` - Détection (mock)
- ✅ `/api/model-info/` - Info modèle
- ✅ `/api/gesture-classes/` - Classes A-Z

---

## 🎊 **Système Prêt !**

Votre système de détection de langage des signes est maintenant **opérationnel** en mode simplifié.

**Pour une précision maximale :**
- Installez TensorFlow : `pip install tensorflow`
- Redémarrez le backend Django
- Le système utilisera automatiquement le vrai modèle

**Bonne détection ! 🤟** 