// Copyright (c) Zefchain Labs, Inc.
// SPDX-License-Identifier: Apache-2.0

fn main() -> Result<(), Box<dyn std::error::Error>> {
    // Get the crate root directory (where Cargo.toml is)
    let manifest_dir = std::env::var("CARGO_MANIFEST_DIR")?;
    
    // Build include paths: crate root + protoc include directory (for google/protobuf/*.proto)
    let mut include_strings = vec![manifest_dir];
    if let Ok(protoc_include) = std::env::var("PROTOC_INCLUDE") {
        include_strings.push(protoc_include);
    }
    // Convert to &str slice for compile_protos
    let include_refs: Vec<&str> = include_strings.iter().map(|s| s.as_str()).collect();
    
    tonic_prost_build::configure()
        .compile_protos(&["proto/indexer.proto"], &include_refs)?;
    Ok(())
}
