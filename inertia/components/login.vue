<script setup lang="ts">
import { ref } from 'vue'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { toast } from '~/components/ui/toast'
import { Button } from '~/components/ui/button'
import { Input } from '~/components/ui/input'
import { User } from '~/models/user'
import { UserAPI } from '~/api/user'

const props = defineProps<{
  isAuthenticated: boolean
}>()

const isAuthenticated = ref(props.isAuthenticated)
const email = ref('')
const password = ref('')
const confirmPassword = ref('')
const isRegistering = ref(!isAuthenticated.value)

const errors = ref<{ email?: string; password?: string; confirmPassword?: string }>({})

function validateForm() {
  errors.value = {}
  let valid = true

  if (!email.value || !/\S+@\S+\.\S+/.test(email.value)) {
    errors.value.email = 'Please enter a valid email address'
    valid = false
  }

  if (!password.value || password.value.length < 8) {
    errors.value.password = 'Password must be at least 8 characters'
    valid = false
  }

  if (isRegistering.value && password.value !== confirmPassword.value) {
    errors.value.confirmPassword = "Passwords don't match"
    valid = false
  }

  return valid
}

function onSubmit(e: Event) {
  e.preventDefault()

  if (validateForm()) {
    const user = new User(email.value, password.value)

    try {
      // get token from api and store
      if (isRegistering.value) {
        UserAPI.register(user).then(() => {
          toast({
            title: 'Registration Successful',
            description: 'Now you can access all the features of the app!',
          })
          isAuthenticated.value = true
          window.location.reload()
        })
      } else {
        UserAPI.login(user).then(() => {
          toast({
            title: 'Login Successful',
            description: 'Now you can access all the features of the app!',
          })
          isAuthenticated.value = true
          window.location.reload()
        })
      }
    } catch (error) {
      toast({
        title: 'An error occurred',
        description: 'Please try again later',
      })
    }
  }
}

function toggleForm() {
  isRegistering.value = !isRegistering.value
}

function logout() {
  isAuthenticated.value = false
  UserAPI.logout()
}
</script>

<template>
  <div v-if="!isAuthenticated">
    <div>
      <Dialog :default-open="!isAuthenticated">
        <DialogTrigger as-child>
          <Button variant="outline">
            {{ isRegistering ? 'Register' : 'Login' }}
          </Button>
        </DialogTrigger>
        <DialogContent class="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{{ isRegistering ? 'Register' : 'Login' }}</DialogTitle>
            <DialogDescription>
              {{ isRegistering ? 'Create a new account.' : 'Log in to your account.' }}
            </DialogDescription>
          </DialogHeader>
          <form class="space-y-6" @submit="onSubmit">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <div class="mt-1">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  v-model="email"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <p v-if="errors.email" class="mt-2 text-sm text-red-600">{{ errors.email }}</p>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <div class="mt-1">
                <Input
                  type="password"
                  placeholder="Enter your password"
                  v-model="password"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <p v-if="errors.password" class="mt-2 text-sm text-red-600">{{ errors.password }}</p>
            </div>

            <div v-if="isRegistering">
              <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
              <div class="mt-1">
                <Input
                  type="password"
                  placeholder="Confirm your password"
                  v-model="confirmPassword"
                  class="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>
              <p v-if="errors.confirmPassword" class="mt-2 text-sm text-red-600">
                {{ errors.confirmPassword }}
              </p>
            </div>

            <DialogFooter class="m-4">
              <Button type="submit">
                {{ isRegistering ? 'Register' : 'Login' }}
              </Button>
            </DialogFooter>
          </form>
          <Button variant="link" @click="toggleForm">
            {{ isRegistering ? 'Already have an account? Login' : 'Need an account? Register' }}
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  </div>
  <div v-else>
    <Button @click="logout">Logout</Button>
  </div>
</template>
