<script setup lang="ts">
import { ref, h } from 'vue'
import { toTypedSchema } from '@vee-validate/zod'
import * as z from 'zod'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '../components/ui/form'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../components/ui/dialog'
import { toast } from "~/components/ui/toast";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";

const props = defineProps<{
  isAuthenticated: boolean
}>()

// Simulating user authentication state
const isAuthenticated = ref(props.isAuthenticated)

const loginSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(8),
}))

const registerSchema = toTypedSchema(z.object({
  email: z.string().email(),
  password: z.string().min(8),
  confirmPassword: z.string().min(8),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
}))

const isRegistering = ref(false)

function onSubmit(values: any) {
  // Here you would typically send the data to your backend
  console.log(values)
  toast({
    title: isRegistering.value ? 'Registration Successful' : 'Login Successful',
    description: h('pre', { class: 'mt-2 w-[340px] rounded-md bg-slate-950 p-4' }, h('code', { class: 'text-white' }, JSON.stringify(values, null, 2))),
  })
  isAuthenticated.value = true
}

function toggleForm() {
  isRegistering.value = !isRegistering.value
}
</script>

<template>
  <div v-if="!isAuthenticated">
    <Form v-slot="{ submitForm }" :validation-schema="isRegistering ? registerSchema : loginSchema" @submit="onSubmit">
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
          <form @submit="submitForm">
            <FormField v-slot="{ componentField }" name="email">
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" placeholder="Enter your email" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-slot="{ componentField }" name="password">
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Enter your password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
            <FormField v-if="isRegistering" v-slot="{ componentField }" name="confirmPassword">
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input type="password" placeholder="Confirm your password" v-bind="componentField" />
                </FormControl>
                <FormMessage />
              </FormItem>
            </FormField>
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
    </Form>
  </div>
  <div v-else>
    <Button @click="isAuthenticated = false">Logout</Button>
  </div>
</template>
