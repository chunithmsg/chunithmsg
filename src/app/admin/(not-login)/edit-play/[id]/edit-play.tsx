'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import type { Score } from '@/models/standing';

const formSchema = z.object({
  competition_id: z.string(),
  ign: z.string().min(1),
  active: z.boolean().default(true),
  disqualified: z.boolean().default(false),
  song1: z.coerce.number().int().min(0).max(1010000),
  song2: z.coerce.number().int().min(0).max(1010000),
  song3: z.coerce.number().int().min(0).max(1010000),
  played_at: z.date(),
});

const EditPlay = ({
  competitions,
  score,
}: {
  competitions: {
    id: string;
    name: string;
  }[] | null;
  score: Score;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competition_id: score.competition_id,
      ign: score.ign,
      active: score.active,
      disqualified: score.disqualified,
      song1: score.song1,
      song2: score.song2,
      song3: score.song3,
      played_at: score.played_at,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const supabase = (
      await import('@supabase/auth-helpers-nextjs')
    ).createClientComponentClient();

    const updatedValues = {
      competition_id: values.competition_id,
      ign: values.ign,
      active: values.active,
      disqualified: values.disqualified,
      song1: values.song1,
      song2: values.song2,
      song3: values.song3,
      total_score: values.song1 + values.song2 + values.song3,
      played_at: values.played_at,
    };

    const { error } = await supabase.from('scores').insert(updatedValues);

    if (error) {
      console.error(error);
      form.setError('competition_id', { message: 'An error occurred' });
      form.setError('ign', { message: 'An error occurred' });
      form.setError('song1', { message: 'An error occurred' });
      form.setError('song2', { message: 'An error occurred' });
      form.setError('song3', { message: 'An error occurred' });
      return;
    }

    router.push('/admin');
  };

  return (
    <>
      <h1>Edit Play</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="my-5 space-y-6">
          <FormField
            control={form.control}
            name="competition_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Competition</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a competition" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {competitions?.map((competition) => (
                      <SelectItem key={competition.id} value={competition.id}>
                        {competition.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>Select a competition</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="ign"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IGN</FormLabel>
                <FormControl>
                  <Input
                    placeholder="IGN"
                    type="text"
                    {...field}
                    defaultValue={field.value}
                    required
                  />
                </FormControl>
                <FormDescription>
                  The IGN of the player who made the play
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex items-center space-x-8">
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
            <FormField
              control={form.control}
              name="disqualified"
              render={({ field }) => (
                <FormItem className="flex items-center space-x-2 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="m-0">Disqualified</FormLabel>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <FormField
            control={form.control}
            name="song1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song 1</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Song 1"
                    type="number"
                    {...field}
                    required
                  />
                </FormControl>
                <FormDescription>The score of the first song</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="song2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song 2</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Song 2"
                    type="number"
                    {...field}
                    required
                  />
                </FormControl>
                <FormDescription>The score of the second song</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="song3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song 3</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Song 3"
                    type="number"
                    {...field}
                    required
                  />
                </FormControl>
                <FormDescription>The score of the third song</FormDescription>
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

export default EditPlay;
