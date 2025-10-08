'use client';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client'; // Your client-side client
// We will use a Server Action to handle the profile creation securely

const SignUpPage = () => {
  const router = useRouter();
  const supabase = createClient();

  const handleSignUp = async (formData: FormData) => {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const username = formData.get('username') as string;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      // Pass username as 'data' to be available on the server side
      options: { data: { username: username } }, 
    });

    if (error) {
      alert(`Sign-up failed: ${error.message}`);
      return;
    }

    if (data.user) {
      // **Crucial Step:** Insert user into the public.users table
      // We call a secure function/API route for this (See step B)
      const profileError = await createProfile({ userId: data.user.id, username, email }); 
      
      if (profileError) {
        alert('Account created, but failed to create profile. Contact admin.');
      } else {
        alert('Success! Check your email for a confirmation link.');
      }
      router.push('/login');
    }
  };

  return (
    <form action={handleSignUp}>
      <input name="email" type="email" placeholder="Email" required />
      <input name="password" type="password" placeholder="Password" required />
      <input name="username" type="text" placeholder="Username" required />
      <button type="submit">Sign Up</button>
    </form>
  );
};
export default SignUpPage;