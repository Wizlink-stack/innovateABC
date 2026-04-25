# Vercel Deployment Setup - Auto Update Instructions

Your project is configured and ready for deployment on Vercel. Here's how to set up auto-updates:

## Option 1: Deploy via Vercel Dashboard (Recommended for Auto-Updates)

1. **Push to GitHub**
   - Create a GitHub repository for this project
   - Add remote: `git remote add origin https://github.com/YOUR_USERNAME/innovateabc.git`
   - Push: `git push -u origin master`

2. **Connect GitHub to Vercel**
   - Go to https://vercel.com/new
   - Select "Import Git Repository"
   - Choose your GitHub repo (innovateabc)
   - Vercel will auto-detect settings (already configured in vercel.json)
   - Click Deploy

3. **Enable Auto-Deployment**
   - After first deploy, any push to GitHub automatically triggers a new Vercel deployment
   - Production deployments on main/master branch
   - Preview deployments on pull requests

## Option 2: Direct Vercel Deployment (One-Time)

If you can't use GitHub, fix the git author first:

```bash
git config user.email "koliton@autos.com"
git config user.name "Koliton Autos"
git commit --amend --no-edit --author="Koliton Autos <koliton@autos.com>"
git push
vercel --prod --yes
```

## Your Current Project Details

- **Vercel Project**: https://vercel.com/wizlinks-projects/innovateabc
- **Team**: wizlink's projects  
- **Current Deployment**: https://innovateabc-mjjdr21j3-wizlinks-projects.vercel.app (ERROR status due to auth)
- **Status**: Waiting for GitHub setup or git author fix

## Next Steps

1. Choose Option 1 or 2 above
2. For Option 1: Push code to GitHub, then import to Vercel
3. After setup, any changes you make and push will auto-update on Vercel

## Environment Variables

Currently set to serve static files. No build needed. All HTML/CSS/JS files served as-is.

