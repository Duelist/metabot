import 'module-alias/register'
import metabot from '@bot/metabot'
import { token } from '@bot/configs/metabot'

// Connect to Discord
metabot.login(token)
