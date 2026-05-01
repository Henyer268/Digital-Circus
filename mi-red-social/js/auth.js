const SUPABASE_URL = 'https://xdhvztdhjotzjwwrwijx.supabase.co'
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhkaHZ6dGRoam90emp3d3J3aWp4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc1OTU3NjQsImV4cCI6MjA5MzE3MTc2NH0.QkHBsglfL6g6WcXXORDGHX26MUzAhFERX0_9M9cGpQI'

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY)

// Redirigir si ya está logueado
supabase.auth.getSession().then(({ data }) => {
  if (data.session) window.location.href = 'feed.html'
})

function showTab(tab) {
  document.querySelectorAll('.auth-form').forEach(f => f.classList.add('hidden'))
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'))
  document.getElementById(tab).classList.remove('hidden')
  event.target.classList.add('active')
  setMessage('')
}

function setMessage(msg, type = 'error') {
  const el = document.getElementById('auth-message')
  el.textContent = msg
  el.className = 'auth-message ' + type
}

async function login() {
  const email = document.getElementById('login-email').value.trim()
  const password = document.getElementById('login-password').value

  if (!email || !password) return setMessage('Completa todos los campos.')

  const { error } = await supabase.auth.signInWithPassword({ email, password })

  if (error) return setMessage('Correo o contraseña incorrectos.')
  
  setMessage('¡Bienvenido! Cargando...', 'success')
  setTimeout(() => window.location.href = 'feed.html', 1000)
}

async function register() {
  const name = document.getElementById('reg-name').value.trim()
  const email = document.getElementById('reg-email').value.trim()
  const password = document.getElementById('reg-password').value

  if (!name || !email || !password) return setMessage('Completa todos los campos.')
  if (password.length < 6) return setMessage('La contraseña debe tener al menos 6 caracteres.')

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { full_name: name } }
  })

  if (error) return setMessage('Error: ' + error.message)

  // Esperar un momento y luego insertar el perfil
  if (data.user) {
    const { error: profileError } = await supabase.from('profiles').insert({
      id: data.user.id,
      full_name: name,
      email: email
    })

    if (profileError) {
      console.error('Error perfil:', profileError)
      return setMessage('Cuenta creada pero error en perfil: ' + profileError.message)
    }

    setMessage('¡Cuenta creada exitosamente!', 'success')
    setTimeout(() => window.location.href = 'feed.html', 1500)
  }
}

  setMessage('¡Cuenta creada! Revisa tu correo para confirmar.', 'success')
}