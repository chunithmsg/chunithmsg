'use client';

/* eslint-disable jsx-a11y/label-has-associated-control */
/* eslint-disable arrow-body-style */
import { useState } from 'react';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Hero, HeroBody } from '@/components/ui/hero';

const formSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

const AdminLoginPage = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const supabase = (
      await import('@supabase/auth-helpers-nextjs')
    ).createClientComponentClient();
    const { error } = await supabase.auth.signInWithPassword({
      email: values.email,
      password: values.password,
    });

    if (error) {
      form.setError('email', { message: 'Invalid email or password entered' });
      form.setError('password', {
        message: 'Invalid email or password entered',
      });
      return;
    }

    router.push('/admin');
  };

  return (
    <Hero>
      <HeroBody className="min-w-full">
        <div className="w-4/5 mx-auto md:w-1/2 xl:w-1/3 2xl:w-1/4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="Email" type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Password"
                        type={showPassword ? 'text' : 'password'}
                        {...field}
                      />
                    </FormControl>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="password-visibility"
                        checked={showPassword}
                        onCheckedChange={() => setShowPassword(!showPassword)}
                      />
                      <label
                        htmlFor="password-visibility"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        Show Password
                      </label>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormMessage />
              <Button className="w-full !mt-6" size="lg" type="submit">
                Submit
              </Button>
            </form>
          </Form>
        </div>
      </HeroBody>
    </Hero>
  );
};

export default AdminLoginPage;
