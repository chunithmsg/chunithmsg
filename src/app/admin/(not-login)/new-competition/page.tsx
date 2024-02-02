'use client';

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
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import type { Database } from '@/libs';

const formSchema = z.object({
  name: z.string().min(1),
  active: z.boolean().default(true),
});

const NewCompetitionPage = () => {
  const router = useRouter();
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      active: true,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const supabase = (
      await import('@supabase/auth-helpers-nextjs')
    ).createClientComponentClient<Database>();
    const { error } = await supabase.from('competitions').insert(values);

    if (error) {
      form.setError('name', { message: 'Error creating competition' });
      return;
    }

    router.push('/admin');
  };

  return (
    <>
      <h1>Add New Competition</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-5 space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Name" type="text" {...field} required />
                </FormControl>
                <FormDescription>
                  The name of the new competition
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="active"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <FormLabel className="m-0">Active</FormLabel>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" variant="default" className="w-full">
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

export default NewCompetitionPage;
