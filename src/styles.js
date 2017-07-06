import styles from './styles.scss'

export const boxShadow = {
  opacities: [0.2, 0.2],
  dynamic: {
    boxShadow: '0 2px 2px {{rgba.0}}, 0 4px 4px {{rgba.0}}, 0 8px 8px {{rgba.0}}, 0 16px 16px {{rgba.0}}, 0 32px 32px {{rgba.1}}, 0 64px 64px {{rgba.1}}'
  }
}

export const popoverBackground = {
  static: {
    backgroundColor: '{{rgb.0}}',
    color: '{{contrastColors.0}}'
  }
}

export const border = {
  static: {
    border: '10px solid {{rgb.0}}',
    borderWidth: '10px'
  },
  dynamic: {
    borderWidth: '0px'
  }
}

export const diagonalBG = {
  opacities: [],
  static: {
    backgroundColor: '{{contrastColors.0}}'
  }
}
