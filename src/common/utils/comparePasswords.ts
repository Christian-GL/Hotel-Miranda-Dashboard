
import * as bcrypt from 'bcryptjs'


export const comparePasswords = async (password: string, hashedPassword: string): Promise<boolean> => {
    try {
        const comparedPasswords = await bcrypt.compare(password, hashedPassword)
        return comparedPasswords
    }
    catch (error) {
        console.error('Error comparing passwords:', error)
        throw new Error('Error comparing passwords')
    }
}