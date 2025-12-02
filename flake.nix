{
  description = "Fedi Mini Apps Catalog";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-25.05";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
      in
      {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.bun
            pkgs.yarn
            pkgs.git
          ];

          shellHook = ''
            # make sure eslint uses the correct config
            unset ESLINT_USE_FLAT_CONFIG
            
            echo "🚀 Fedi Mini Apps Catalog Development Environment"
            echo "Run 'bun dev' to start the development server"
          '';
        };
      }
    );
}

