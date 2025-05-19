// File: api/src/routers/auth.js
import express from 'express'
import { authAdmin } from '../lib/firebaseAdmin.js'
import User from '../models/User.js'

const router = express.Router()

// body: { idToken, role }
router.post('/register', async (req, res) => {
    console.log('🔔  POST /auth/register →', req.body)
    try {
      const { idToken, role } = req.body
      const { uid, email } = await authAdmin.verifyIdToken(idToken)
      console.log('📌  got Firebase user', { uid, email, role })
  
      console.log('🔍  looking for existing user with uid=', uid)
      let user = await User.findOne({ uid })
      console.log('🔎  findOne returned', user)
  
      if (!user) {
        user = await User.create({ uid, email, role })
        console.log('✅  Created new user:', user)
      } else {
        console.log('⚠️   User already existed, skipping create.')
      }
  
      return res.json({ ok: true, user })
    } catch (e) {
      console.error('❌  /auth/register error', e)
      return res.status(400).json({ ok: false, error: e.message })
    }
  })


  router.get('/me', async (req, res) => {
    try {
      const authHeader = req.headers.authorization || ''
      const idToken = authHeader.replace('Bearer ', '')
      if (!idToken) return res.status(401).json({ ok: false, error: 'No token' })
  
      const { uid } = await authAdmin.verifyIdToken(idToken)
      const user = await User.findOne({ uid })
      if (!user) return res.status(404).json({ ok: false, error: 'User not found' })
  
      res.json({ ok: true, user })
    } catch (e) {
      console.error('/auth/me error', e)
      res.status(401).json({ ok: false, error: e.message })
    }
  })
  

export default router