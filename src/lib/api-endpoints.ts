export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

export interface EndpointParam {
  name: string;
  type: "path" | "query" | "body" | "header";
  required: boolean;
  description: string;
  example?: string;
}

export interface ApiEndpoint {
  id: string;
  method: HttpMethod;
  path: string;
  auth: string;
  description: string;
  params: EndpointParam[];
  exampleResponse: string;
}

export interface EndpointGroup {
  name: string;
  prefix: string;
  endpoints: ApiEndpoint[];
}

export const API_BASE_URL = "https://api.streamMG.railway.app/api";

export const endpointGroups: EndpointGroup[] = [
  {
    name: "Auth",
    prefix: "/auth",
    endpoints: [
      {
        id: "auth-register",
        method: "POST",
        path: "/auth/register",
        auth: "Public",
        description: "Inscription d'un nouvel utilisateur",
        params: [
          { name: "username", type: "body", required: true, description: "Nom d'utilisateur", example: "Rabe" },
          { name: "email", type: "body", required: true, description: "Adresse email", example: "rabe@exemple.mg" },
          { name: "password", type: "body", required: true, description: "Mot de passe", example: "MotDePasse1" },
        ],
        exampleResponse: JSON.stringify({
          token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
          user: { _id: "...", username: "Rabe", role: "user", isPremium: false }
        }, null, 2),
      },
      {
        id: "auth-login",
        method: "POST",
        path: "/auth/login",
        auth: "Public",
        description: "Connexion utilisateur",
        params: [
          { name: "email", type: "body", required: true, description: "Adresse email", example: "rabe@exemple.mg" },
          { name: "password", type: "body", required: true, description: "Mot de passe", example: "MotDePasse1" },
        ],
        exampleResponse: JSON.stringify({
          token: "eyJhbGci...",
          user: { _id: "...", username: "Rabe", role: "premium", isPremium: true }
        }, null, 2),
      },
      {
        id: "auth-refresh",
        method: "POST",
        path: "/auth/refresh",
        auth: "Cookie",
        description: "Renouvellement du JWT via refresh token",
        params: [],
        exampleResponse: JSON.stringify({ token: "eyJhbGci..." }, null, 2),
      },
      {
        id: "auth-logout",
        method: "POST",
        path: "/auth/logout",
        auth: "JWT",
        description: "Déconnexion et suppression du refresh token",
        params: [],
        exampleResponse: JSON.stringify({ message: "Déconnecté" }, null, 2),
      },
    ],
  },
  {
    name: "Catalogue",
    prefix: "/contents",
    endpoints: [
      {
        id: "contents-list",
        method: "GET",
        path: "/contents",
        auth: "Public",
        description: "Liste paginée avec filtres",
        params: [
          { name: "page", type: "query", required: false, description: "Numéro de page", example: "1" },
          { name: "limit", type: "query", required: false, description: "Nombre par page", example: "20" },
          { name: "type", type: "query", required: false, description: "video | audio", example: "video" },
          { name: "category", type: "query", required: false, description: "film, salegy, hira_gasy, tsapiky, beko, documentaire, podcast, tutoriel", example: "salegy" },
          { name: "accessType", type: "query", required: false, description: "free | premium | paid", example: "free" },
          { name: "search", type: "query", required: false, description: "Recherche textuelle", example: "salegy" },
        ],
        exampleResponse: JSON.stringify({
          contents: [{
            _id: "65f3a2b4c8e9d1234567890b",
            title: "Mora Mora",
            type: "audio",
            category: "salegy",
            thumbnail: "/uploads/thumbnails/mora_mora_e1f4a.jpg",
            duration: 243,
            accessType: "free",
            price: null,
            isTutorial: false,
            artist: "Tarika Sammy",
            viewCount: 1842,
          }],
          total: 148, page: 1, pages: 8,
        }, null, 2),
      },
      {
        id: "contents-featured",
        method: "GET",
        path: "/contents/featured",
        auth: "Public",
        description: "Contenus mis en avant",
        params: [],
        exampleResponse: JSON.stringify({ contents: [{ _id: "...", title: "Mora Mora", category: "salegy" }] }, null, 2),
      },
      {
        id: "contents-trending",
        method: "GET",
        path: "/contents/trending",
        auth: "Public",
        description: "Top 10 de la semaine",
        params: [],
        exampleResponse: JSON.stringify({ contents: [{ _id: "...", title: "Mora Mora", viewCount: 1842 }] }, null, 2),
      },
      {
        id: "contents-detail",
        method: "GET",
        path: "/contents/:id",
        auth: "Public",
        description: "Détail d'un contenu",
        params: [
          { name: "id", type: "path", required: true, description: "ID du contenu", example: "65f3a2b4c8e9d1234567890b" },
        ],
        exampleResponse: JSON.stringify({
          _id: "65f3a2b4c8e9d1234567890b",
          title: "Mora Mora",
          type: "audio",
          category: "salegy",
          description: "Un classique du salegy malgache",
          thumbnail: "/uploads/thumbnails/mora_mora_e1f4a.jpg",
          duration: 243,
          accessType: "free",
          viewCount: 1842,
        }, null, 2),
      },
      {
        id: "contents-view",
        method: "POST",
        path: "/contents/:id/view",
        auth: "Public",
        description: "Incrémenter le compteur de vues",
        params: [
          { name: "id", type: "path", required: true, description: "ID du contenu", example: "65f3a2b4c8e9d1234567890b" },
        ],
        exampleResponse: JSON.stringify({ viewCount: 1843 }, null, 2),
      },
      {
        id: "contents-lessons",
        method: "GET",
        path: "/contents/:id/lessons",
        auth: "JWT + checkAccess",
        description: "Leçons d'un tutoriel",
        params: [
          { name: "id", type: "path", required: true, description: "ID du contenu tutoriel", example: "65f3a2b4c8e9d1234567890b" },
        ],
        exampleResponse: JSON.stringify({ lessons: [{ title: "Introduction", duration: 120 }] }, null, 2),
      },
    ],
  },
  {
    name: "Streaming HLS",
    prefix: "/hls",
    endpoints: [
      {
        id: "hls-token",
        method: "GET",
        path: "/hls/:id/token",
        auth: "JWT + checkAccess",
        description: "Token HLS signé + URL manifest",
        params: [
          { name: "id", type: "path", required: true, description: "ID du contenu", example: "65f3a2b4c8e9d1234567890b" },
        ],
        exampleResponse: JSON.stringify({
          hlsUrl: "/hls/65f3a2b4.../index.m3u8?token=eyJhbGciOiJIUzI1NiJ9...",
          expiresIn: 600,
        }, null, 2),
      },
    ],
  },
  {
    name: "Download",
    prefix: "/download",
    endpoints: [
      {
        id: "download-request",
        method: "POST",
        path: "/download/:id",
        auth: "JWT + checkAccess",
        description: "Clé AES-256 + IV + URL signée pour téléchargement mobile",
        params: [
          { name: "id", type: "path", required: true, description: "ID du contenu", example: "65f3a2b4c8e9d1234567890b" },
        ],
        exampleResponse: JSON.stringify({
          aesKeyHex: "a3f9b2c1d4e5f6a7b8c9d0e1f2a3b4c5...",
          ivHex: "b7c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6",
          signedUrl: "https://api.streamMG.railway.app/private/65f3a2b4...?expires=...&sig=...",
          expiresIn: 900,
        }, null, 2),
      },
    ],
  },
  {
    name: "Historique",
    prefix: "/history",
    endpoints: [
      {
        id: "history-save",
        method: "POST",
        path: "/history/:contentId",
        auth: "JWT",
        description: "Enregistrer la progression de lecture",
        params: [
          { name: "contentId", type: "path", required: true, description: "ID du contenu", example: "65f3a2b4c8e9d1234567890b" },
          { name: "progress", type: "body", required: true, description: "Progression en secondes", example: "145" },
          { name: "completed", type: "body", required: false, description: "Lecture terminée", example: "false" },
        ],
        exampleResponse: JSON.stringify({ message: "Progression enregistrée" }, null, 2),
      },
      {
        id: "history-list",
        method: "GET",
        path: "/history",
        auth: "JWT",
        description: "Historique de l'utilisateur",
        params: [],
        exampleResponse: JSON.stringify({ history: [{ contentId: "...", progress: 145, completed: false }] }, null, 2),
      },
    ],
  },
  {
    name: "Tutoriels",
    prefix: "/tutorial",
    endpoints: [
      {
        id: "tutorial-progress-update",
        method: "POST",
        path: "/tutorial/progress/:contentId",
        auth: "JWT",
        description: "Mise à jour de la progression d'une leçon",
        params: [
          { name: "contentId", type: "path", required: true, description: "ID du tutoriel", example: "65f3a2b4c8e9d1234567890b" },
          { name: "lessonIndex", type: "body", required: true, description: "Index de la leçon", example: "0" },
          { name: "completed", type: "body", required: true, description: "Leçon terminée", example: "true" },
        ],
        exampleResponse: JSON.stringify({
          completedLessons: [0],
          lastLessonIndex: 0,
          percentComplete: 16.67,
        }, null, 2),
      },
      {
        id: "tutorial-progress-list",
        method: "GET",
        path: "/tutorial/progress",
        auth: "JWT",
        description: "Tutoriels en cours",
        params: [],
        exampleResponse: JSON.stringify({
          inProgress: [{
            contentId: { _id: "...", title: "Apprendre le salegy", thumbnail: "/uploads/thumbnails/tuto.jpg" },
            lastLessonIndex: 2,
            percentComplete: 37.5,
          }],
        }, null, 2),
      },
    ],
  },
  {
    name: "Paiements",
    prefix: "/payment",
    endpoints: [
      {
        id: "payment-subscribe",
        method: "POST",
        path: "/payment/subscribe",
        auth: "JWT",
        description: "Abonnement Premium",
        params: [
          { name: "plan", type: "body", required: true, description: "Plan d'abonnement", example: "monthly" },
        ],
        exampleResponse: JSON.stringify({ clientSecret: "pi_3Oq...secret_..." }, null, 2),
      },
      {
        id: "payment-purchase",
        method: "POST",
        path: "/payment/purchase",
        auth: "JWT",
        description: "Achat unitaire d'un contenu",
        params: [
          { name: "contentId", type: "body", required: true, description: "ID du contenu", example: "65f3a2b4c8e9d1234567890d" },
        ],
        exampleResponse: JSON.stringify({ clientSecret: "pi_3Oq...secret_..." }, null, 2),
      },
      {
        id: "payment-purchases",
        method: "GET",
        path: "/payment/purchases",
        auth: "JWT",
        description: "Liste des achats",
        params: [],
        exampleResponse: JSON.stringify({
          purchases: [{
            _id: "...",
            contentId: { _id: "...", title: "Ny Fitiavana", thumbnail: "/uploads/thumbnails/ny_fitiavana.jpg", type: "video" },
            amount: 800000,
            purchasedAt: "2026-02-15T16:22:10.000Z",
          }],
        }, null, 2),
      },
      {
        id: "payment-status",
        method: "GET",
        path: "/payment/status",
        auth: "JWT",
        description: "Statut Premium de l'utilisateur",
        params: [],
        exampleResponse: JSON.stringify({ isPremium: true, premiumExpiry: "2026-03-15T00:00:00.000Z" }, null, 2),
      },
    ],
  },
  {
    name: "Admin",
    prefix: "/admin",
    endpoints: [
      {
        id: "admin-stats",
        method: "GET",
        path: "/admin/stats",
        auth: "JWT + admin",
        description: "Statistiques globales",
        params: [],
        exampleResponse: JSON.stringify({
          totalUsers: 284,
          premiumUsers: 47,
          totalContents: 312,
          totalViews: 18420,
          topPurchasedContents: [{ title: "Ny Fitiavana", totalSales: 12, totalRevenue: 9600000 }],
          recentPurchases30d: 38,
          revenueSimulated30d: 28500000,
        }, null, 2),
      },
      {
        id: "admin-users",
        method: "GET",
        path: "/admin/users",
        auth: "JWT + admin",
        description: "Liste des utilisateurs",
        params: [],
        exampleResponse: JSON.stringify({ users: [{ _id: "...", username: "Rabe", role: "user", isPremium: false }] }, null, 2),
      },
    ],
  },
];
