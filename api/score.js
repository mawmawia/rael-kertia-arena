export default async (req, res) => {
  if(req.method === 'POST') {
    const data = JSON.parse(req.body);
    console.log('Score saved:', data);
    // V1: console.log. V2: await kv.hset('scores', data.id, JSON.stringify(data))
  }
  res.status(200).json({ok: true});
};
