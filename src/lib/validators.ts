import { ActorType, ClusterType, DataLevel } from '@prisma/client'

export function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export function isEnumValue<T extends string>(value: string, enums: Record<string, T>): value is T {
  return Object.values(enums).includes(value as T)
}

export function validateActorType(value: string): value is ActorType {
  return isEnumValue(value, ActorType)
}

export function validateDataLevel(value: string): value is DataLevel {
  return isEnumValue(value, DataLevel)
}

export function validateCluster(value: string): value is ClusterType {
  return isEnumValue(value, ClusterType)
}
