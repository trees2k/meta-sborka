import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)

/**
 * Миграция для создания всех необходимых таблиц
 * Запусти это один раз при развёртывании
 */
export async function runMigrations() {
  try {
    // 1. Таблица пользователей (если ещё нет)
    await supabase.rpc('create_users_table', {}, { head: true }).catch(() => null)

    // 2. Таблица анкет игроков
    const { error: profileError } = await supabase.from('player_profiles').select('id').limit(1)
    if (profileError?.code === 'PGRST116') {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS player_profiles (
            id UUID PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
            faceit_nickname VARCHAR(255),
            faceit_elo INTEGER DEFAULT 800,
            premier_points INTEGER DEFAULT 0,
            main_role VARCHAR(50),
            communication_style VARCHAR(50),
            tilt_reaction VARCHAR(50),
            main_goal VARCHAR(255),
            bio TEXT,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          )
        `
      }).catch(() => null)
    }

    // 3. Таблица хайлайтов
    const { error: highlightError } = await supabase.from('highlights').select('id').limit(1)
    if (highlightError?.code === 'PGRST116') {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS highlights (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            video_url VARCHAR(500),
            demo_id VARCHAR(255),
            title VARCHAR(255),
            description TEXT,
            thumbnail_url VARCHAR(500),
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user_id, demo_id)
          )
        `
      }).catch(() => null)
    }

    // 4. Таблица чатов
    const { error: chatError } = await supabase.from('chats').select('id').limit(1)
    if (chatError?.code === 'PGRST116') {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS chats (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user1_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            user2_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            last_message_at TIMESTAMP DEFAULT NOW(),
            created_at TIMESTAMP DEFAULT NOW(),
            UNIQUE(user1_id, user2_id),
            CHECK (user1_id < user2_id)
          )
        `
      }).catch(() => null)
    }

    // 5. Таблица сообщений
    const { error: messageError } = await supabase.from('messages').select('id').limit(1)
    if (messageError?.code === 'PGRST116') {
      await supabase.rpc('exec_sql', {
        sql: `
          CREATE TABLE IF NOT EXISTS messages (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            chat_id UUID NOT NULL REFERENCES chats(id) ON DELETE CASCADE,
            sender_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
            content TEXT NOT NULL,
            is_read BOOLEAN DEFAULT FALSE,
            created_at TIMESTAMP DEFAULT NOW(),
            updated_at TIMESTAMP DEFAULT NOW()
          );
          CREATE INDEX IF NOT EXISTS idx_messages_chat_id ON messages(chat_id);
          CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
        `
      }).catch(() => null)
    }

    console.log('✅ Миграции завершены')
  } catch (error) {
    console.error('❌ Ошибка миграции:', error)
  }
}
