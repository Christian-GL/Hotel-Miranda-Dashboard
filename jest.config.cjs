
module.exports = {
    transform: {
        '^.+\\.jsx?$': 'babel-jest', // Transforma archivos .js o .jsx usando babel-jest
    },
    testEnvironment: 'jsdom', // Usa jsdom para simular un entorno de navegador
    moduleNameMapper: {
        '\\.(css|less|scss|sass)$': 'identity-obj-proxy', // Simula importaciones de CSS
    },
}