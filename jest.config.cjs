
// module.exports = {
//     preset: 'ts-jest',
//     testEnvironment: 'jsdom',
//     transform: {
//         '^.+\\.(js|jsx)$': 'babel-jest',
//         '^.+\\.tsx?$': 'ts-jest',        // Typescript/TSX
//         '^.+\\.jsx?$': 'babel-jest'      // JS/JSX
//     },
//     // setupFilesAfterEnv: ['<rootDir>/src/index.test.js/setupTests.ts'],    // Antes de ejecutar cualquier test, carga este archivo primero
//     // moduleNameMapper: {
//     //     '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
//     //     '\\.(png|jpg|jpeg|gif|svg)$': '<rootDir>/__mocks__/fileMock.js',
//     //     '^@/(.*)$': '<rootDir>/src/$1'      // mapea alias @/xxx -> src/xxx
//     // },
//     moduleDirectories: ['node_modules', '<rootDir>/src'],
//     moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
//     testPathIgnorePatterns: ['/node_modules/', '/dist/']
// }

module.exports = {
    testEnvironment: 'jsdom',

    transform: {
        '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest',
    },

    moduleDirectories: ['node_modules', '<rootDir>/src'],

    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],

    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
}


// Ejecutar todos los tests del proyecto:
// npm run test

// Ejecutar test concreto:
// npm test -- src/index.test.js/carpeta/xxx.test.ts