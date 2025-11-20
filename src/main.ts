import { mount } from 'svelte'
import './app.css'
import App from './App.svelte'
import posthog from 'posthog-js'

// Initialize PostHog when running in the browser
const POSTHOG_KEY = import.meta.env.VITE_POSTHOG_KEY as string
const POSTHOG_HOST = import.meta.env.VITE_POSTHOG_HOST as string

if (typeof window !== 'undefined' && POSTHOG_KEY) {
  posthog.init(POSTHOG_KEY, {
    api_host: POSTHOG_HOST,
  })

}

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
