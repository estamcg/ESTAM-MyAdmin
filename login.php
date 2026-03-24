<?php
declare(strict_types=1);

require_once __DIR__ . '/api/security_headers.php';

if (session_status() === PHP_SESSION_NONE) {
  ini_set('session.use_strict_mode', '1');
  ini_set('session.cookie_httponly', '1');
  ini_set('session.cookie_samesite', 'Lax');
  if (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') {
    ini_set('session.cookie_secure', '1');
  }
  session_start();
}

// If already logged in, go to app
if (!empty($_SESSION['admin_id'])) {
  header('Location: index.php');
  exit;
}
?>
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Connexion — ESTAM MyAdmin</title>
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css">
  <style>
    :root{--navy:#1A2340;--red:#E30613;--bg:#F8FAFC;--muted:#6B7280;--border:#E5E7EB}
    *{box-sizing:border-box}
    body{margin:0;font-family:Inter,system-ui,Arial;background:var(--bg);min-height:100vh;display:flex;align-items:center;justify-content:center;padding:16px}
    .wrap{background:#fff;border-radius:32px;box-shadow:0 30px 80px rgba(17,24,39,.20);display:flex;max-width:980px;width:100%;min-height:580px;overflow:hidden}
    .left{width:48%;padding:42px;position:relative;background:
      radial-gradient(circle at 0% 0%, rgba(26,35,64,.85), transparent 50%),
      radial-gradient(circle at 75% 20%, rgba(227,6,19,.22), transparent 45%),
      linear-gradient(145deg, #1A2340 0%, #26345f 100%);color:#fff;display:flex;flex-direction:column;justify-content:space-between}
    .right{width:52%;padding:40px 42px;display:flex;align-items:center}
    .brand{font-size:30px;font-weight:900;letter-spacing:-.5px}
    .tag{font-size:11px;letter-spacing:.18em;text-transform:uppercase;opacity:.75;margin-bottom:8px}
    .hero{font-size:34px;line-height:1.15;margin:0;font-weight:800}
    .hero-sub{margin-top:10px;color:#E5E7EB;font-size:14px}
    .bubble{position:absolute;left:-35px;bottom:-35px;width:210px;height:210px;border-radius:50%;background:rgba(255,255,255,.12);filter:blur(2px)}
    .panel{width:100%}
    .panel.hidden{display:none}
    h2{margin:0;color:#111827;font-size:32px;font-weight:800}
    .sub{margin:8px 0 20px;color:var(--muted);font-size:13px}
    .label-row{display:flex;justify-content:space-between;align-items:center}
    label{display:block;font-size:11px;font-weight:800;color:#374151;text-transform:uppercase;letter-spacing:.08em;margin:10px 0 6px}
    .field{position:relative}
    .icon{position:absolute;left:14px;top:50%;transform:translateY(-50%);color:#9CA3AF}
    input{width:100%;padding:12px 12px 12px 40px;border:1px solid var(--border);border-radius:12px;outline:none;font-size:14px}
    input:focus{border-color:var(--navy);box-shadow:0 0 0 4px rgba(26,35,64,.08)}
    .link{font-size:12px;color:var(--navy);text-decoration:none;font-weight:700;cursor:pointer;background:none;border:none}
    .btn{width:100%;border:none;border-radius:12px;padding:13px 14px;font-weight:800;cursor:pointer}
    .btn-main{background:var(--navy);color:#fff;margin-top:14px}
    .btn-main:hover{filter:brightness(.95)}
    .btn-back{background:#F3F4F6;color:#374151;margin-top:8px}
    .err{display:none;margin-bottom:12px;background:#FEF2F2;border:1px solid #FCA5A5;color:var(--red);border-radius:10px;padding:10px 12px;font-size:13px}
    .ok{display:none;margin-bottom:12px;background:#ECFDF5;border:1px solid #86EFAC;color:#166534;border-radius:10px;padding:10px 12px;font-size:13px}
    .hint{margin-top:16px;padding-top:14px;border-top:1px solid #F1F5F9;text-align:center;color:#9CA3AF;font-size:12px}
    @media (max-width:900px){.wrap{flex-direction:column;min-height:auto}.left,.right{width:100%}.left{min-height:230px}.hero{font-size:28px}}
  </style>
</head>
<body>
  <div class="wrap">
    <section class="left">
      <div class="brand">ESTAM MyAdmin</div>
      <div>
        <div class="tag">Portail Administrateur</div>
        <h1 class="hero">Accedez a votre espace de travail personnel</h1>
        <p class="hero-sub">Connexion securisee par matricule et mot de passe.</p>
      </div>
      <div class="bubble"></div>
    </section>

    <section class="right">
      <div class="panel" id="panel-login">
        <h2>Connexion</h2>
        <p class="sub">Veuillez saisir vos identifiants fournis par l'administration.</p>
        <div class="err" id="err"><i class="fa-solid fa-triangle-exclamation"></i> <span id="err-msg">Connexion refusee.</span></div>
        <div class="ok" id="ok"><i class="fa-solid fa-circle-check"></i> <span id="ok-msg">Operation reussie.</span></div>

        <label>Numero de Matricule / Identifiant</label>
        <div class="field">
          <i class="fa-solid fa-id-badge icon"></i>
          <input id="u" autocomplete="username" placeholder="Ex: admin" />
        </div>

        <div class="label-row">
          <label>Mot de passe</label>
          <button class="link" type="button" id="open-forgot">Oublie ?</button>
        </div>
        <div class="field">
          <i class="fa-solid fa-lock icon"></i>
          <input id="p" type="password" autocomplete="current-password" placeholder="••••••••" />
        </div>

        <button class="btn btn-main" id="btn"><i class="fa-solid fa-right-to-bracket"></i> Se connecter</button>
        <div class="hint">Support acces : contactez votre Super Admin.</div>
      </div>

      <div class="panel hidden" id="panel-forgot">
        <h2>Reinitialisation</h2>
        <p class="sub">Saisissez votre matricule et un nouveau mot de passe.</p>
        <div class="err" id="err-reset"><i class="fa-solid fa-triangle-exclamation"></i> <span id="err-reset-msg">Erreur.</span></div>
        <div class="ok" id="ok-reset"><i class="fa-solid fa-circle-check"></i> <span id="ok-reset-msg">Reinitialisation terminee.</span></div>

        <label>Matricule / Identifiant</label>
        <div class="field">
          <i class="fa-solid fa-id-badge icon"></i>
          <input id="r-u" autocomplete="username" placeholder="Ex: admin" />
        </div>

        <label>Nouveau mot de passe</label>
        <div class="field">
          <i class="fa-solid fa-key icon"></i>
          <input id="r-p1" type="password" autocomplete="new-password" placeholder="Minimum 8 caracteres" />
        </div>

        <label>Confirmer le mot de passe</label>
        <div class="field">
          <i class="fa-solid fa-key icon"></i>
          <input id="r-p2" type="password" autocomplete="new-password" placeholder="Retaper le mot de passe" />
        </div>

        <button class="btn btn-main" id="btn-reset"><i class="fa-solid fa-rotate"></i> Reinitialiser</button>
        <button class="btn btn-back" id="back-login"><i class="fa-solid fa-arrow-left"></i> Retour a la connexion</button>
      </div>
    </section>
  </div>

  <script>
    const u = document.getElementById('u');
    const p = document.getElementById('p');
    const btn = document.getElementById('btn');
    const err = document.getElementById('err');
    const errMsg = document.getElementById('err-msg');
    const ok = document.getElementById('ok');
    const okMsg = document.getElementById('ok-msg');

    const panelLogin = document.getElementById('panel-login');
    const panelForgot = document.getElementById('panel-forgot');
    const openForgot = document.getElementById('open-forgot');
    const backLogin = document.getElementById('back-login');
    const resetBtn = document.getElementById('btn-reset');

    const ru = document.getElementById('r-u');
    const rp1 = document.getElementById('r-p1');
    const rp2 = document.getElementById('r-p2');
    const errReset = document.getElementById('err-reset');
    const errResetMsg = document.getElementById('err-reset-msg');
    const okReset = document.getElementById('ok-reset');
    const okResetMsg = document.getElementById('ok-reset-msg');

    function showLogin() {
      panelForgot.classList.add('hidden');
      panelLogin.classList.remove('hidden');
      err.style.display = 'none';
      ok.style.display = 'none';
    }
    function showForgot() {
      panelLogin.classList.add('hidden');
      panelForgot.classList.remove('hidden');
      errReset.style.display = 'none';
      okReset.style.display = 'none';
      ru.value = u.value.trim();
      ru.focus();
    }

    async function login() {
      err.style.display = 'none';
      ok.style.display = 'none';
      const username = (u.value || '').trim();
      const password = p.value || '';
      if (!username || !password) {
        errMsg.textContent = 'Veuillez saisir identifiant et mot de passe.';
        err.style.display = 'block';
        return;
      }
      btn.disabled = true;
      try {
        const res = await fetch('api/login.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({ username, password })
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok || j.status !== 'success') {
          errMsg.textContent = j.message || 'Identifiant ou mot de passe incorrect.';
          err.style.display = 'block';
          p.value = '';
          p.focus();
          return;
        }
        window.location.href = 'index.php';
      } finally {
        btn.disabled = false;
      }
    }

    async function resetPassword() {
      errReset.style.display = 'none';
      okReset.style.display = 'none';
      const username = (ru.value || '').trim();
      const newPassword = rp1.value || '';
      const confirmPassword = rp2.value || '';
      if (!username || !newPassword || !confirmPassword) {
        errResetMsg.textContent = 'Veuillez remplir tous les champs.';
        errReset.style.display = 'block';
        return;
      }
      resetBtn.disabled = true;
      try {
        const res = await fetch('api/reset_password.php', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'same-origin',
          body: JSON.stringify({
            username,
            new_password: newPassword,
            confirm_password: confirmPassword
          })
        });
        const j = await res.json().catch(() => ({}));
        if (!res.ok || j.status !== 'success') {
          errResetMsg.textContent = j.message || 'Reinitialisation impossible.';
          errReset.style.display = 'block';
          return;
        }
        okResetMsg.textContent = j.message || 'Mot de passe reinitialise.';
        okReset.style.display = 'block';
        u.value = username;
        p.value = '';
        rp1.value = '';
        rp2.value = '';
      } finally {
        resetBtn.disabled = false;
      }
    }

    openForgot.addEventListener('click', showForgot);
    backLogin.addEventListener('click', showLogin);
    btn.addEventListener('click', login);
    p.addEventListener('keydown', (e) => { if (e.key === 'Enter') login(); });
    resetBtn.addEventListener('click', resetPassword);
    rp2.addEventListener('keydown', (e) => { if (e.key === 'Enter') resetPassword(); });
  </script>
</body>
</html>

