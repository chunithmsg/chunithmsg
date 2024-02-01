'use client';

import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { useQuery } from '@tanstack/react-query';

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
import { getCompetitions } from '@/queries';

const formSchema = z.object({
  competition_id: z.string(),
  ign: z.string().min(1),
  active: z.boolean().default(true),
  isDisqualified: z.boolean().default(false),
  song1: z.coerce.number().int().min(0).max(1001000),
  song2: z.coerce.number().int().min(0).max(1001000),
  song3: z.coerce.number().int().min(0).max(1001000),
  totalScore: z.coerce.number().min(0).max(3003000),
  timestamp: z.number().default(0),
});

const NewPlay = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['competitions'],
    queryFn: getCompetitions,
  });
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      competition_id: '',
      ign: '',
      active: true,
      isDisqualified: false,
      song1: 0,
      song2: 0,
      song3: 0,
      totalScore: 0,
      timestamp: new Date().getTime(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    console.log(values);
    const supabase = (
      await import('@supabase/auth-helpers-nextjs')
    ).createClientComponentClient();
  };

  return (
    <>
      <h1>Add New Play</h1>
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
                      <SelectValue
                        placeholder={
                          isLoading ? 'Loading...' : 'Select a competition'
                        }
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {isLoading ? (
                      <SelectItem disabled value="">
                        Loading...
                      </SelectItem>
                    ) : (
                      data?.map((competition) => (
                        <SelectItem key={competition.id} value={competition.id}>
                          {competition.name}
                        </SelectItem>
                      ))
                    )}
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
              name="isDisqualified"
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
          <FormField
            control={form.control}
            name="totalScore"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Score</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Total Score"
                    type="number"
                    {...field}
                    required
                  />
                </FormControl>
                <FormDescription>The total score of all songs</FormDescription>
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

export default NewPlay;
