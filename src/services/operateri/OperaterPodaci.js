import bcrypt from 'bcryptjs'

const hashiranaLozinka = bcrypt.hashSync('Edunova123!', 10)

export const operateri = [
    {
        id: '1',
        email: 'admin@pawalert.hr',
        lozinka: hashiranaLozinka,
        uloga: 'admin'
    },
    {
        id: '2',
        email: 'operater@pawalert.hr',
        lozinka: hashiranaLozinka,
        uloga: 'korisnik'
    }
]

export default{
    operateri
}