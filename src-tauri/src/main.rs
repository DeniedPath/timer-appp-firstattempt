use tauri::Manager;
use std::fs::File;
use rodio::{Decoder, OutputStream, Sink};

#[tauri::command]
fn play_sound(path: &str) -> Result<(), String> {
    let file = File::open(path).map_err(|e| e.to_string())?;
    let source = Decoder::new(file).map_err(|e| e.to_string())?;
    
    let (_stream, handle) = OutputStream::try_default().map_err(|e| e.to_string())?;
    let sink = Sink::try_new(&handle).map_err(|e| e.to_string())?;
    
    sink.append(source);
    Ok(())
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![play_sound])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}