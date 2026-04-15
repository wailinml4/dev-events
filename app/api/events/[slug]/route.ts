import { NextResponse } from 'next/server';

import connectDB from '@/lib/db';
import { Event } from '@/models/event.model';

type EventRouteParams = Promise<{
  slug: string;
}>;

const SLUG_PATTERN = /^[a-z0-9]+(?:[-_][a-z0-9]+)*$/;

/**
 * Validate and normalize the dynamic slug route parameter.
 */
function parseSlug(value: string | undefined): string {
  const normalizedSlug = value?.trim().toLowerCase();

  if (!normalizedSlug) {
    throw new Error('Event slug is required.');
  }

  if (!SLUG_PATTERN.test(normalizedSlug)) {
    throw new Error('Event slug format is invalid.');
  }

  return normalizedSlug;
}

/**
 * Fetch a single event by its unique slug.
 */
export async function GET(
  _request: Request,
  { params }: { params: EventRouteParams }
) {
  try {
    const { slug } = await params;
    const parsedSlug = parseSlug(slug);

    await connectDB();

    const event = await Event.findOne({ slug: parsedSlug });

    if (!event) {
      return NextResponse.json(
        { message: 'Event not found.' },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: 'Event fetched successfully.',
        event,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message === 'Event slug is required.' ||
        error.message === 'Event slug format is invalid.'
      ) {
        return NextResponse.json(
          { message: error.message },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          message: 'Failed to fetch event.',
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: 'Failed to fetch event.',
        error: 'Unknown error',
      },
      { status: 500 }
    );
  }
}