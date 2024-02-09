'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

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
import { SongStatus } from '@/models/standing';
import type { Database, Tables } from '@/libs';

const formSchema = z.object({
  competition_id: z.string().min(1, {
    message: 'Competition is required',
  }),
  ign: z.string().min(1),
  active: z.boolean(),
  disqualified: z.boolean(),
  song1: z.coerce.number().int().min(0).max(1010000),
  song1_type: z.nativeEnum(SongStatus),
  song2: z.coerce.number().int().min(0).max(1010000),
  song2_type: z.nativeEnum(SongStatus),
  song3: z.coerce.number().int().min(0).max(1010000),
  song3_type: z.nativeEnum(SongStatus),
  // played_at: z.date(),
});

const EditPlay = ({
  competitions,
  score,
}: {
  competitions: Array<Tables<'competitions'>> | null;
  score: Tables<'scores'> | null;
}) => {
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competition_id: score?.competition_id,
      ign: score?.ign,
      active: score?.active,
      disqualified: score?.disqualified,
      song1: score?.song1,
      song1_type: score?.song1_type,
      song2: score?.song2,
      song2_type: score?.song2_type,
      song3: score?.song3,
      song3_type: score?.song3_type,
      // played_at: score?.played_at,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    toast.info('Updating play...');
    const supabase = (
      await import('@supabase/auth-helpers-nextjs')
    ).createClientComponentClient<Database>();

    if (score === null) {
      toast.error('Play does not exist');
      return;
    }

    const updatedValues = {
      competition_id: values.competition_id,
      ign: values.ign,
      active: values.active,
      disqualified: values.disqualified,
      song1: values.song1,
      song1_type: values.song1_type,
      song2: values.song2,
      song2_type: values.song2_type,
      song3: values.song3,
      song3_type: values.song3_type,
      total_score: values.song1 + values.song2 + values.song3,
      played_at: score.played_at,
    };

    const { error } = await supabase
      .from('scores')
      .update(updatedValues)
      .eq('id', score.id);

    if (error) {
      toast.error('Unable to update play', {
        description: error.message,
      });
      return;
    }

    toast.success('Play updated successfully');
    // * using native window method to force a redirect to grab new data
    window.location.href = '/admin';
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
                  <Input placeholder="IGN" type="text" {...field} required />
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
            name="song1_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song 1 Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select song status (AJC, AJ, FC)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={SongStatus.AJC}>
                      {SongStatus.AJC}
                    </SelectItem>
                    <SelectItem value={SongStatus.AJ}>
                      {SongStatus.AJ}
                    </SelectItem>
                    <SelectItem value={SongStatus.FC}>
                      {SongStatus.FC}
                    </SelectItem>
                    <SelectItem value={SongStatus.NONE}>
                      {SongStatus.NONE}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the status of the first song
                </FormDescription>
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
            name="song2_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song 2 Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select song status (AJC, AJ, FC)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={SongStatus.AJC}>
                      {SongStatus.AJC}
                    </SelectItem>
                    <SelectItem value={SongStatus.AJ}>
                      {SongStatus.AJ}
                    </SelectItem>
                    <SelectItem value={SongStatus.FC}>
                      {SongStatus.FC}
                    </SelectItem>
                    <SelectItem value={SongStatus.NONE}>
                      {SongStatus.NONE}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the status of the second song
                </FormDescription>
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
          <FormField
            control={form.control}
            name="song3_type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Song 3 Type</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select song status (AJC, AJ, FC)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value={SongStatus.AJC}>
                      {SongStatus.AJC}
                    </SelectItem>
                    <SelectItem value={SongStatus.AJ}>
                      {SongStatus.AJ}
                    </SelectItem>
                    <SelectItem value={SongStatus.FC}>
                      {SongStatus.FC}
                    </SelectItem>
                    <SelectItem value={SongStatus.NONE}>
                      {SongStatus.NONE}
                    </SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  Select the status of the third song
                </FormDescription>
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
