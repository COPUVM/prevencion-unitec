import { generateIcsFromQuery } from '../src/utils/calendarFeed';

export default function handler(
  req: { url?: string },
  res: {
    statusCode: number;
    setHeader(name: string, value: string): void;
    end(chunk?: string): void;
  }
) {
  const url = new URL(req.url || '/', 'https://localhost');
  const icsContent = generateIcsFromQuery(url.searchParams);

  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/calendar; charset=utf-8');
  res.setHeader('Content-Disposition', 'inline; filename="plan_preventivo_unitec.ics"');
  res.setHeader('Cache-Control', 'public, max-age=3600');
  res.end(icsContent);
}
