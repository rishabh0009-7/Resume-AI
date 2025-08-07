// lib/user-sync.ts
import { currentUser } from '@clerk/nextjs/server'
import { prisma } from './prisma'

export async function ensureUserExists() {
  const user = await currentUser()
  
  if (!user) {
    return null
  }

  try {
    // Check if user exists in database
    let dbUser = await prisma.user.findUnique({
      where: { clerkId: user.id }
    })

    // Create user if doesn't exist
    if (!dbUser) {
      dbUser = await prisma.user.create({
        data: {
          clerkId: user.id,
          email: user.emailAddresses[0]?.emailAddress || '',
          firstName: user.firstName,
          lastName: user.lastName,
        }
      })
    }

    return dbUser
  } catch (error) {
    console.error('Error syncing user:', error)
    return null
  }
}