export function GET() {
  const allKeys = Object.keys(process.env);
  const relevant = allKeys.filter((k) =>
    /^(GOOGLE_|RAZORPAY_|VITE_|VERCEL_)/.test(k)
  );
  const info = relevant.map((k) => ({ key: k, length: process.env[k]?.length ?? 0 }));
  return Response.json({ totalEnvVarCount: allKeys.length, relevant: info });
}
