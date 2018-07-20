const PATHS = {
  NODE_MODULES: /^node_modules\//,
  SCRIPTS: /^src\/scripts\//,
  STYLES: /^src\/styles\//
}

exports.files = {
  javascripts: {
    joinTo: {
      'vendor.js': PATHS.NODE_MODULES,
      'main.js': PATHS.SCRIPTS
    }
  },
  stylesheets: {
    joinTo: {
      'vendor.css': PATHS.NODE_MODULES,
      'main.css': PATHS.STYLES
    }
  }
};

exports.modules = {
  autoRequire: {
    'main.js': ['main']
  },
  nameCleaner: path => path.replace(PATHS.SCRIPTS, '')
}

exports.npm = {
  styles: {
    'normalize.css': ['normalize.css']
  },
  globals: {
    gsap: 'gsap'
  },
  compilers: ['babel-brunch']
}

exports.paths = {
  watched: ['src']
};

exports.plugins = {
  babel: {
    presets: ['latest']
  }
};

exports.server = {
  port: 3000
};
