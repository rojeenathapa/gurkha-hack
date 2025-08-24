# 🚀 Quick Deployment Guide - rojeenathapa/gurkha-hack

## **Repository Setup**
Your repository: `https://github.com/rojeenathapa/gurkha-hack`

## **📋 Pre-Deployment Steps**

### **1. Ensure All Files Are Committed**
```bash
# Check current status
git status

# Add all files
git add .

# Commit changes
git commit -m "Add DigitalOcean deployment configuration"

# Push to GitHub
git push origin main
```

### **2. Verify File Structure**
Your repository should now contain:
- ✅ `.do/app.yaml` - DigitalOcean configuration
- ✅ `gurkha-hack/` - Backend folder (already exists)
- ✅ `app/` - Frontend Next.js app
- ✅ `components/` - React components
- ✅ `deploy-digitalocean.sh` - Deployment script

## **🌊 Deploy to DigitalOcean**

### **Step 1: Go to DigitalOcean**
1. Visit [cloud.digitalocean.com](https://cloud.digitalocean.com)
2. Sign in or create account

### **Step 2: Create App**
1. Click "Apps" in left sidebar
2. Click "Create App"
3. Choose "GitHub" as source
4. Connect your GitHub account
5. Select repository: `rojeenathapa/gurkha-hack`

### **Step 3: Configure App**
DigitalOcean will automatically detect your `.do/app.yaml` configuration:

**App Name**: `litterly-waste-classification`
**Region**: Choose closest to your users
**Branch**: `main`

### **Step 4: Review Services**
**Frontend Service**:
- Source: `/` (root)
- Build: `npm run build`
- Run: `npm start`
- Size: Basic XXS ($5/month)

**Backend Service**:
- Source: `/gurkha-hack`
- Build: `pip install -r requirements.txt`
- Run: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Size: Basic S ($12/month)

### **Step 5: Deploy**
1. Click "Create Resources"
2. Wait for build (5-10 minutes)
3. Your app will be available at: `https://litterly-waste-classification.ondigitalocean.app`

## **🔍 Post-Deployment Testing**

1. **Frontend**: Visit your app URL
2. **Backend**: Test API at `/api` endpoints
3. **Image Classification**: Upload an image to test
4. **Performance**: Check DigitalOcean dashboard

## **💰 Cost**
- **Total**: $17/month
- **Frontend**: $5/month
- **Backend**: $12/month

## **🚨 Troubleshooting**

### **Build Issues**
- Check build logs in DigitalOcean dashboard
- Ensure `yolov8m-seg.pt` is in `gurkha-hack/` folder
- Verify all dependencies are in `requirements.txt`

### **Model Issues**
- Ensure model file is committed to repository
- Check file permissions
- Verify model path in environment variables

## **📞 Support**
- **DigitalOcean Docs**: [docs.digitalocean.com](https://docs.digitalocean.com)
- **App Platform**: [docs.digitalocean.com/products/app-platform](https://docs.digitalocean.com/products/app-platform)

---

**Happy Deploying! 🚀**
Your app will be live at: `https://litterly-waste-classification.ondigitalocean.app`
