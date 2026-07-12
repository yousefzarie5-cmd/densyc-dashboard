'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getSupabaseBrowser } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { toast } from 'sonner'
import { Loader2 } from 'lucide-react'

function LoginContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect') || '/'

  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)

  const supabase = getSupabaseBrowser()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (mode === 'signin') {
        const { error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) throw error
        toast.success('Welcome back!')
        router.replace(redirect)
        router.refresh()
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { data: { name, role: 'Clinic Owner' } },
        })
        if (error) throw error
        toast.success('Account created. You can sign in now.')
        setMode('signin')
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Authentication failed')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = async (demoEmail: string, role: string) => {
    setLoading(true)
    const demoPassword = 'Password123!'
    try {
      // First try to sign in
      const { error: signInError } = await supabase.auth.signInWithPassword({ 
        email: demoEmail, 
        password: demoPassword 
      })
      
      if (signInError) {
        if (signInError.message.toLowerCase().includes('invalid login credentials')) {
          // Auto-create the demo account
          const { error: signUpError } = await supabase.auth.signUp({
            email: demoEmail,
            password: demoPassword,
            options: { data: { name: `Demo ${role}`, role: role } }
          })
          if (signUpError) throw signUpError
          toast.success(`Demo ${role} account created and signed in!`)
        } else {
          throw signInError
        }
      } else {
        toast.success(`Welcome back, Demo ${role}!`)
      }
      
      router.replace(redirect)
      router.refresh()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Demo login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 py-8">
      <Card className="w-full max-w-md border-border">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Densyc</CardTitle>
          <CardDescription>
            {mode === 'signin' ? 'Sign in to your dashboard' : 'Create your account'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'signup' && (
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} placeholder="Dr. Yousef" required />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@densyc.com" required />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required minLength={6} />
            </div>
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={loading}>
              {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              {mode === 'signin' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm text-muted-foreground">
            {mode === 'signin' ? (
              <button className="hover:text-foreground" onClick={() => setMode('signup')} type="button">
                No account? Create one
              </button>
            ) : (
              <button className="hover:text-foreground" onClick={() => setMode('signin')} type="button">
                Already have an account? Sign in
              </button>
            )}
          </div>
        </CardContent>
        
        {/* Sandbox Demo Accounts */}
        <div className="px-6 pb-6">
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or Sandbox Demo</span>
            </div>
          </div>
          <div className="flex flex-col gap-2">
            <Button variant="outline" type="button" onClick={() => handleDemoLogin('owner@demo.com', 'Clinic Owner')} disabled={loading} className="w-full">
              Login with Mock Data (owner@demo.com)
            </Button>
            <Button variant="outline" type="button" onClick={() => handleDemoLogin('blank@demo.com', 'Clinic Owner')} disabled={loading} className="w-full">
              Login Blank Account (blank@demo.com)
            </Button>
          </div>
        </div>
      </Card>
    </div>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center">Loading...</div>}>
      <LoginContent />
    </Suspense>
  )
}
