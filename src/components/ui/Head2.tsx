export default function Head2({ num, title, en }: { num: React.ReactNode; title: string; en?: string }) {
  return (<div className="hd2" data-reveal><div className="num">{num}</div><div><h2>{title}</h2>{en && <div className="en">{en}</div>}</div></div>);
}
