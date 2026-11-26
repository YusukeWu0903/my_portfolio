import { notFound } from 'next/navigation';
import { projects } from '../../data/projects';
import OpeningProject from './OpeningProject';

export default async function OpenProjectPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const project = projects.find(item => item.id === id);

  if (!project) notFound();

  if (project.desktopDownload) {
    return (
      <main className="min-h-screen bg-[#FFFDF5] px-6 py-16 text-[#173c37]">
        <section className="mx-auto max-w-2xl rounded-3xl border border-[#173c37]/20 bg-white p-8 sm:p-12">
          <a href="/" className="text-sm underline underline-offset-4">← 回作品集</a>
          <p className="mt-10 text-sm tracking-widest">GODOT · WINDOWS / WEB</p>
          <h1 className="mt-3 text-3xl font-bold">{project.title}</h1>
          <p className="mt-5 leading-8">{project.description}</p>
          <h2 className="mt-8 text-xl font-bold">Windows 正式版</h2>
          <p className="mt-2 leading-7">{project.desktopVersion} · Windows 64 位元 · 持續開發中</p>
          <a href={project.desktopDownload} className="mt-5 inline-block rounded-xl bg-[#173c37] px-6 py-4 font-bold text-white">下載 Windows 版（ZIP）</a>
          <ol className="mt-6 list-decimal space-y-2 pl-5 leading-7"><li>下載後完整解壓縮 ZIP。</li><li>執行 HexTactics.exe，保留同資料夾的 HexTactics.pck。</li><li>無須安裝 Godot；進度會保存在這台電腦。</li></ol>
          <p className="mt-4 text-sm leading-6 text-neutral-600">此版本尚未簽署程式碼，Windows 可能顯示發行者無法驗證的提示。</p>
          <hr className="my-8 border-[#173c37]/15" />
          <h2 className="text-xl font-bold">先在瀏覽器試玩</h2>
          <p className="mt-3 leading-7">免下載體驗同一套 Godot 遊戲。網頁版與 Windows 版存檔分開，不會自動同步；首次載入需下載遊戲資源。</p>
          <a href={project.link} target="_blank" rel="noopener noreferrer" className="mt-5 inline-block rounded-xl border border-[#173c37] px-6 py-3 font-bold">網頁試玩 ↗</a>
        </section>
      </main>
    );
  }

  return <OpeningProject title={project.title} destination={project.link} />;
}
