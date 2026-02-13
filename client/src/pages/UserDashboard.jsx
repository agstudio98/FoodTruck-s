import { useState, useContext, useEffect, useRef } from "react";
import { AuthContext } from "../context/AuthContext";

export default function UserDashboard() {
  const { user, updateUser } = useContext(AuthContext);
  const { fetchUser, logout } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState("profile");
  
  // Estado local para el formulario
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    profilePic: "",
    address: "",
  });

  // Sincronizar el formulario cuando el usuario carga
  useEffect(() => {
    if (user) {
      setFormData({
        name: user.name || "",
        phone: user.phone || "",
        profilePic: user.profilePic || "",
        address: user.address || "",
      });
    }
  }, [user]);

  // Cargar usuario cuando monta el componente (si no está en contexto)
  useEffect(() => {
    if (!user) {
      const storedUser = JSON.parse(localStorage.getItem('user') || 'null');
      if (storedUser && (storedUser._id || storedUser.id)) {
        const id = storedUser._id || storedUser.id;
        fetchUser(id).catch(err => console.error('Error loading user:', err));
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const fileInputRef = useRef(null);

  const handleFileButton = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, profilePic: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const result = await updateUser(formData);
    if (result?.success) {
      alert("Perfil actualizado en la nube ☁️");
    } else {
      alert("Hubo un problema al guardar: " + (result?.msg || "respuesta inválida"));
    }
  };

  // --- SECURITY TAB ---
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [tokens, setTokens] = useState(user?.tokens || []);
  const [securityLoading, setSecurityLoading] = useState(false);

  useEffect(() => { setTokens(user?.tokens || []); }, [user]);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) return alert('La nueva contraseña no coincide');
    setSecurityLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/auth/change-password', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user?._id || user?.id, currentPassword, newPassword })
      });
      if (res.ok) {
        alert('Contraseña cambiada con éxito');
        setCurrentPassword(''); setNewPassword(''); setConfirmPassword('');
      } else {
        const txt = await res.text();
        alert('Error: ' + txt);
      }
    } catch (err) { console.error(err); alert('Error de red'); }
    setSecurityLoading(false);
  };

  const handleCreateToken = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/auth/token', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id || user?.id })
      });
      if (res.ok) {
        const data = await res.json();
        alert('Token creado: ' + data.token);
        await fetchUser(user?._id || user?.id);
      } else {
        alert('No se pudo crear token');
      }
    } catch (err) { console.error(err); alert('Error de red'); }
  };

  const handleDeleteToken = async (token) => {
    try {
      const res = await fetch(`http://localhost:5000/api/auth/token/${user?._id || user?.id}/${token}`, { method: 'DELETE' });
      if (res.ok) { await fetchUser(user?._id || user?.id); }
    } catch (err) { console.error(err); }
  };

  // --- PAYMENTS TAB ---
  const [payments, setPayments] = useState([]);
  const [paymentsLoading, setPaymentsLoading] = useState(false);
  const [newCard, setNewCard] = useState({ nameOnCard: '', cardNumber: '', expMonth: '', expYear: '', isDefault: false, provider: 'card', providerAccountId: '' });

  const formatCardNumber = (value) => {
    const digits = (value || '').replace(/\D/g, '').slice(0,16);
    return digits.replace(/(.{4})/g, '$1 ').trim();
  };

  const detectBrand = (num) => {
    const digits = (num || '').replace(/\D/g, '');
    if (!digits) return { brand: '', icon: '' };
    if (/^4/.test(digits)) return { brand: 'Visa', icon: '💳' };
    if (/^5[1-5]/.test(digits)) return { brand: 'Mastercard', icon: '💳' };
    if (/^3[47]/.test(digits)) return { brand: 'Amex', icon: '💳' };
    if (/^6/.test(digits)) return { brand: 'Discover', icon: '💳' };
    return { brand: '', icon: '💳' };
  };

  const fetchPayments = async () => {
    if (!user) return;
    setPaymentsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/payments/${user?._id || user?.id}`);
      if (res.ok) { const list = await res.json(); setPayments(list); }
    } catch (err) { console.error(err); }
    setPaymentsLoading(false);
  };

  useEffect(() => {
    if (activeTab === 'payments' && user) fetchPayments();
  }, [activeTab, user]);

  const handleAddPayment = async (e) => {
    e?.preventDefault();
    try {
      const res = await fetch('http://localhost:5000/api/payments', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user?._id || user?.id, ...newCard })
      });
      if (res.ok) { setNewCard({ nameOnCard: '', cardNumber: '', expMonth: '', expYear: '', isDefault: false, provider: 'card', providerAccountId: '' }); fetchPayments(); }
      else { alert('No se pudo agregar el método'); }
    } catch (err) { console.error(err); alert('Error de red'); }
  };

  const handleDeletePayment = async (id) => {
    if (!confirm('Eliminar método de pago?')) return;
    try {
      const res = await fetch(`http://localhost:5000/api/payments/${id}`, { method: 'DELETE' });
      if (res.ok) fetchPayments();
    } catch (err) { console.error(err); }
  };

  return (
    <div className="ios-dashboard-bg">
      <div className="ios-container fade-in">
        
        {/* LOADING STATE */}
        {!user ? (
          <div style={{gridColumn: '1 / -1', padding: '40px', textAlign: 'center', color: '#fff', fontSize: '18px'}}>
            Cargando usuario...
          </div>
        ) : (
        <>
        {/* SIDEBAR GLASS */}
        <aside className="ios-sidebar glass-ios">
          <div className="ios-profile-header">
            <div 
              className="ios-avatar" 
              style={{ 
                backgroundImage: `url(${formData.profilePic || 'https://www.svgrepo.com/show/508699/landscape-placeholder.svg'})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center'
              }}
            ></div>
            <h2 className="ios-username">{formData.name || "Miembro"}</h2>
          </div>
          
          <nav className="ios-nav">
            <button className={activeTab === "profile" ? "active" : ""} onClick={() => setActiveTab("profile")}>Cuenta</button>
            <button className={activeTab === "security" ? "active" : ""} onClick={() => setActiveTab("security")}>Seguridad</button>
            <button className={activeTab === "payments" ? "active" : ""} onClick={() => setActiveTab("payments")}>Pagos</button>
          </nav>
        </aside>

        {/* CONTENT GLASS */}
        <main className="ios-main glass-ios">
          {activeTab === "profile" && (
            <section className="ios-tab">
              <h1 className="ios-title">Información</h1>
              <form onSubmit={handleUpdate} className="ios-form">
                <div className="ios-input-section">
                  <label>FOTO DE PERFIL (URL)</label>
                  <div style={{display: 'flex', gap: 8, alignItems: 'center'}}>
                    <input type="text" name="profilePic" value={formData.profilePic} onChange={handleChange} placeholder="https://..." />
                    <button type="button" className="ios-btn-secondary" onClick={handleFileButton} style={{padding: '6px 10px'}}>Examinar</button>
                  </div>
                  <input
                    ref={fileInputRef}
                    id="profile-file-input"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                  />
                </div>
                
                <div className="ios-input-group">
                  <div className="ios-input-section">
                    <label>NOMBRE</label>
                    <input type="text" name="name" value={formData.name} onChange={handleChange} />
                  </div>
                  <div className="ios-input-section">
                    <label>TELÉFONO</label>
                    <input type="text" name="phone" value={formData.phone} onChange={handleChange} />
                  </div>
                </div>

                <div className="ios-input-section">
                  <label>DIRECCIÓN</label>
                  <input type="text" name="address" value={formData.address} onChange={handleChange} />
                </div>

                <button type="submit" className="ios-btn-primary">Actualizar Cambios</button>
              </form>
            </section>
          )}

          {activeTab === "security" && (
            <section className="ios-tab">
              <h1 className="ios-title">Seguridad</h1>

              <div style={{display: 'grid', gap: 18}}>
                <div className="ios-card-item">
                  <h3 style={{margin:0}}>Cambiar Contraseña</h3>
                  <form onSubmit={handleChangePassword} style={{display: 'grid', gap:8, marginTop:8}}>
                    <input placeholder="Contraseña actual" type="password" value={currentPassword} onChange={(e)=>setCurrentPassword(e.target.value)} />
                    <input placeholder="Nueva contraseña" type="password" value={newPassword} onChange={(e)=>setNewPassword(e.target.value)} />
                    <input placeholder="Confirmar nueva" type="password" value={confirmPassword} onChange={(e)=>setConfirmPassword(e.target.value)} />
                    <div style={{display:'flex', gap:8}}>
                      <button type="submit" className="ios-btn-primary">Cambiar Contraseña</button>
                      <button type="button" className="ios-btn-secondary" onClick={()=>{ setCurrentPassword(''); setNewPassword(''); setConfirmPassword(''); }}>Limpiar</button>
                    </div>
                  </form>
                </div>

                <div className="ios-card-item">
                  <h3 style={{margin:0}}>Tokens de Seguridad</h3>
                  <div style={{display:'flex', gap:8, marginTop:8}}>
                    <button className="ios-btn-primary" onClick={handleCreateToken}>Crear Token</button>
                    <button className="ios-btn-secondary" onClick={()=>fetchUser(user?._id || user?.id)}>Refrescar</button>
                  </div>
                  <ul style={{marginTop:10}}>
                    {tokens && tokens.length === 0 && <li style={{color:'#999'}}>No hay tokens</li>}
                    {tokens && tokens.map(t => (
                      <li key={t.token} style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'6px 0'}}>
                        <span style={{fontFamily:'monospace'}}>{t.token}</span>
                        <div style={{display:'flex',gap:8}}>
                          <small style={{color:'#999'}}>{new Date(t.createdAt).toLocaleString()}</small>
                          <button className="ios-btn-secondary" onClick={()=>handleDeleteToken(t.token)}>Eliminar</button>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="ios-card-item">
                  <h3 style={{margin:0}}>Two-Factor (2FA)</h3>
                  <div style={{display:'grid',gap:8,marginTop:8}}>
                    <label style={{display:'flex',alignItems:'center',gap:8}}>
                      <input type="checkbox" checked={user?.twoFactorEnabled || false} onChange={async (e)=>{
                        const val = e.target.checked;
                        // update via context
                        await updateUser({ twoFactorEnabled: val });
                        await fetchUser(user?._id || user?.id);
                      }} /> Habilitar Two-Factor
                    </label>
                    <input placeholder="Clave 2FA (opcional)" value={user?.twoFactorSecret || ''} onChange={(e)=>{ /* local only */ }} onBlur={async (e)=>{ const v = e.target.value; await updateUser({ twoFactorSecret: v }); await fetchUser(user?._id || user?.id); }} />
                    <small style={{color:'#999'}}>Guarda aquí una clave o secreto para 2FA. Opcional.</small>
                  </div>
                </div>

                <div className="ios-card-item">
                  <h3 style={{margin:0}}>Salir de la cuenta</h3>
                  <div style={{marginTop:8}}>
                    <button className="ios-btn-secondary" onClick={() => { logout(); }}>Cerrar Sesión</button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "payments" && (
            <section className="ios-tab">
              <h1 className="ios-title">Pagos</h1>

              <div style={{display:'grid', gap:16}}>
                <div>
                  <h3>Agregar Método</h3>
                  <form onSubmit={handleAddPayment} style={{display:'grid', gap:8, maxWidth:520}}>
                    <input placeholder="Nombre en la tarjeta" value={newCard.nameOnCard} onChange={(e)=>setNewCard({...newCard, nameOnCard: e.target.value})} />

                    <div style={{display:'flex',gap:8,alignItems:'center'}}>
                      <input placeholder="Número de tarjeta (solo demo)" value={newCard.cardNumber} onChange={(e)=>setNewCard({...newCard, cardNumber: formatCardNumber(e.target.value)})} style={{flex:1}} />
                      <div style={{minWidth:40,textAlign:'center'}}>{detectBrand(newCard.cardNumber).icon}</div>
                    </div>

                    <div style={{display:'flex',gap:8}}>
                      <input placeholder="MM" value={newCard.expMonth} onChange={(e)=>{ const v = e.target.value.replace(/\D/g,'').slice(0,2); setNewCard({...newCard, expMonth: v}); }} style={{width:70}} />
                      <input placeholder="YYYY" value={newCard.expYear} onChange={(e)=>{ const v = e.target.value.replace(/\D/g,'').slice(0,4); setNewCard({...newCard, expYear: v}); }} style={{width:110}} />
                      <label style={{display:'flex',alignItems:'center',gap:6}}><input type="checkbox" checked={newCard.isDefault} onChange={(e)=>setNewCard({...newCard, isDefault: e.target.checked})}/> Predeterminar</label>
                    </div>

                    <div style={{display:'grid',gap:8}}>
                      <label style={{fontSize:13,color:'#bbb'}}>Proveedor</label>
                      <select value={newCard.provider} onChange={(e)=>setNewCard({...newCard, provider: e.target.value})} style={{padding:10,borderRadius:8}}>
                        <option value="card">Tarjeta</option>
                        <option value="modo">MODO</option>
                        <option value="mercadopago">MercadoPago</option>
                      </select>
                      {newCard.provider !== 'card' && (
                        <input placeholder="ID de cuenta / código (proveedor)" value={newCard.providerAccountId} onChange={(e)=>setNewCard({...newCard, providerAccountId: e.target.value})} />
                      )}
                    </div>

                    <div style={{display:'flex',gap:8}}>
                      <button type="submit" className="ios-btn-primary">Agregar Método</button>
                      <button type="button" className="ios-btn-secondary" onClick={()=>setNewCard({ nameOnCard: '', cardNumber: '', expMonth: '', expYear: '', isDefault: false, provider: 'card', providerAccountId: '' })}>Limpiar</button>
                    </div>
                  </form>
                </div>

                <div>
                  <h3>Tus métodos</h3>
                  {paymentsLoading ? <div>Cargando...</div> : (
                    <div style={{display:'grid',gap:10}}>
                      {payments.length === 0 && <div className="ios-card-item">No hay métodos registrados</div>}
                      {payments.map(pm => (
                        <div key={pm._id} className="ios-card-item" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                          <div style={{display:'flex',gap:12,alignItems:'center'}}>
                            <div style={{fontSize:20}}>{pm.provider === 'card' ? (pm.brand || '💳') : (pm.provider === 'modo' ? '📲' : '🛒')}</div>
                            <div>
                              <div style={{fontWeight:700}}>{pm.provider === 'card' ? (pm.brand || 'Tarjeta') : pm.provider} **** {pm.last4}</div>
                              <div style={{fontSize:12,color:'#bbb'}}>{pm.provider === 'card' ? `Vence ${pm.expMonth}/${pm.expYear} · ${pm.nameOnCard}` : `Cuenta: ${pm.providerAccountId || pm.token}`}</div>
                            </div>
                          </div>
                          <div style={{display:'flex',gap:8,alignItems:'center'}}>
                            {pm.isDefault && <span className="ios-status">Predeterminada</span>}
                            {!pm.isDefault && <button className="ios-btn-secondary" onClick={async ()=>{ await fetch(`http://localhost:5000/api/payments/${pm._id}`, { method: 'PATCH', headers: {'Content-Type':'application/json'}, body: JSON.stringify({ isDefault: true }) }); fetchPayments(); }}>Hacer predeterminada</button>}
                            <button className="ios-btn-secondary" onClick={()=>handleDeletePayment(pm._id)}>Eliminar</button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </section>
          )}
        </main>
        </>
        )}
      </div>
    </div>
  );
}