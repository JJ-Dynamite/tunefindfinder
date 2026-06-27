use axum::{
    routing::{get, post},
    Router,
    Json,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use tower_http::cors::{CorsLayer, Any};
use tracing_subscriber;

#[derive(Serialize)]
struct HealthResponse {
    status: String,
    service: String,
    version: String,
}

#[derive(Serialize)]
struct ApiResponse<T: Serialize> {
    success: bool,
    data: Option<T>,
    error: Option<String>,
}

#[derive(Serialize)]
struct Song {
    id: String,
    title: String,
    artist: String,
    album: String,
    season: u32,
    episode: u32,
    timestamp: String,
    show_name: String,
}

#[derive(Deserialize)]
struct SearchRequest {
    query: String,
    show_name: Option<String>,
}

async fn health_check() -> impl IntoResponse {
    Json(HealthResponse {
        status: "healthy".to_string(),
        service: "Find songs from any show".to_string(),
        version: env!("CARGO_PKG_VERSION").to_string(),
    })
}

async fn root() -> impl IntoResponse {
    Json(ApiResponse::<()> {
        success: true,
        data: None,
        error: None,
    })
}

async fn search_songs(Json(req): Json<SearchRequest>) -> impl IntoResponse {
    let songs = vec![
        Song {
            id: "1".to_string(),
            title: "Running Up That Hill".to_string(),
            artist: "Kate Bush".to_string(),
            album: "Hounds of Love".to_string(),
            season: 4,
            episode: 1,
            timestamp: "00:45:23".to_string(),
            show_name: req.show_name.clone().unwrap_or("Stranger Things".to_string()),
        },
        Song {
            id: "2".to_string(),
            title: "Separate Ways".to_string(),
            artist: "Journey".to_string(),
            album: "Frontiers".to_string(),
            season: 4,
            episode: 7,
            timestamp: "00:32:15".to_string(),
            show_name: req.show_name.clone().unwrap_or("Stranger Things".to_string()),
        },
    ];

    Json(ApiResponse {
        success: true,
        data: Some(songs),
        error: None,
    })
}

async fn get_popular_shows() -> impl IntoResponse {
    let shows = vec![
        serde_json::json!({
            "name": "Stranger Things",
            "songs_count": 89,
            "genre": "Sci-Fi/Horror"
        }),
        serde_json::json!({
            "name": "Euphoria",
            "songs_count": 156,
            "genre": "Drama"
        }),
        serde_json::json!({
            "name": "The Office",
            "songs_count": 67,
            "genre": "Comedy"
        }),
    ];

    Json(ApiResponse {
        success: true,
        data: Some(shows),
        error: None,
    })
}

async fn get_stats() -> impl IntoResponse {
    Json(ApiResponse {
        success: true,
        data: Some(serde_json::json!({
            "total_songs": 234567,
            "shows_tracked": 1234,
            "identifications_today": 45678
        })),
        error: None,
    })
}

#[tokio::main]
async fn main() {
    tracing_subscriber::fmt::init();

    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    let app = Router::new()
        .route("/", get(root))
        .route("/health", get(health_check))
        .route("/api/search", post(search_songs))
        .route("/api/shows", get(get_popular_shows))
        .route("/api/stats", get(get_stats))
        .layer(cors);

    let listener = tokio::net::TcpListener::bind("0.0.0.0:3001")
        .await
        .unwrap();

    tracing::info!("Find songs from any show backend running on port 3001");
    axum::serve(listener, app).await.unwrap();
}
