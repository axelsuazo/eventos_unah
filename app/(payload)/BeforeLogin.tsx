import React from "react";

export default function BeforeLogin() {
  return (
    <div
      style={{
        width: "100%",
        maxWidth: "420px",
        margin: "0 auto 24px auto",
        padding: "28px",
        borderRadius: "24px",
        background: "linear-gradient(135deg, #183972 0%, #0f172a 100%)",
        color: "#ffffff",
        boxShadow: "0 18px 45px rgba(15, 23, 42, 0.22)",
        textAlign: "center",
      }}
    >
      <div
        style={{
          width: "64px",
          height: "64px",
          margin: "0 auto 16px auto",
          borderRadius: "999px",
          background: "#f5c400",
          color: "#183972",
          display: "grid",
          placeItems: "center",
          fontSize: "28px",
          fontWeight: 900,
        }}
      >
        U
      </div>

      <p
        style={{
          margin: 0,
          fontSize: "12px",
          fontWeight: 800,
          letterSpacing: "0.18em",
          textTransform: "uppercase",
          color: "#f5c400",
        }}
      >
        Panel Administrativo
      </p>

      <h1
        style={{
          margin: "10px 0 8px 0",
          fontSize: "30px",
          fontWeight: 900,
          lineHeight: 1.1,
        }}
      >
        Eventos UNAH
      </h1>

      <p
        style={{
          margin: 0,
          fontSize: "14px",
          lineHeight: 1.6,
          color: "#dbeafe",
        }}
      >
        Inicia sesión para administrar eventos, imágenes y publicaciones del
        sistema.
      </p>
    </div>
  );
}