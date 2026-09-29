"use client";
import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Matter from "matter-js";
import { syne } from "@/lib/fonts";
import { Blobatar } from "blobatar/react";
import { BOOK_CALL_URL, CONTACT_EMAIL, navLinks } from "@/lib/content";
import EstimateButton from "@/components/estimate/EstimateButton";


type ShapeData = { id: number; type: "head" | "text"; content: string; w: number; h: number; x: number; y: number };

// Matter.Mouse exposes its DOM handlers at runtime, but @types/matter-js doesn't declare them.
type MouseHandlers = {
  mousemove: (e: Event) => void;
  mousedown: (e: Event) => void;
  mouseup: (e: Event) => void;
  mousewheel: (e: Event) => void;
};

const WALL = 200;
const footerLink = "text-foreground/60 hover:text-foreground transition-colors pointer-events-auto w-fit";

export default function Footer() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const elementsRef = useRef<Array<HTMLDivElement | null>>([]);
  const [shapesData, setShapesData] = useState<ShapeData[]>([]);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const engine = Matter.Engine.create();
    const world = engine.world;

    const width = scene.clientWidth || window.innerWidth;
    const height = scene.clientHeight || 500;

    // Thick walls so fast-thrown bodies can't tunnel through
    const wallOptions = { isStatic: true };
    const floor = Matter.Bodies.rectangle(width / 2, height + WALL / 2, width * 3, WALL, wallOptions);
    const leftWall = Matter.Bodies.rectangle(-WALL / 2, height / 2, WALL, height * 4, wallOptions);
    const rightWall = Matter.Bodies.rectangle(width + WALL / 2, height / 2, WALL, height * 4, wallOptions);

    Matter.World.add(world, [floor, leftWall, rightWall]);

    const shapes: Matter.Body[] = [];
    const shapeMetadata: ShapeData[] = [];
    let idCounter = 0;
    // Keep spawn positions fully inside the walls
    const spawnX = (w: number) => w / 2 + Math.random() * Math.max(0, width - w);
    const spawnY = () => -100 - Math.random() * 500;

    // Add Blobatar heads
    for (let i = 0; i < 6; i++) {
      const radius = 40;
      const body = Matter.Bodies.circle(spawnX(radius * 2), spawnY(), radius, { restitution: 0.8 });
      shapes.push(body);
      shapeMetadata.push({ id: idCounter++, type: "head", content: `avatar-${i}`, w: radius * 2, h: radius * 2, x: body.position.x, y: body.position.y });
    }

    // Add Text blocks
    const texts = ["GRAVITY", "DRAG ME", "ONE PERCENT", "HELLO"];
    texts.forEach((text) => {
      const w = text.length * 16 + 40;
      const h = 50;
      const body = Matter.Bodies.rectangle(spawnX(w), spawnY(), w, h, { restitution: 0.5, chamfer: { radius: 25 } });
      shapes.push(body);
      shapeMetadata.push({ id: idCounter++, type: "text", content: text, w, h, x: body.position.x, y: body.position.y });
    });

    Matter.World.add(world, shapes);
    setShapesData(shapeMetadata);

    const mouse = Matter.Mouse.create(scene);
    const handlers = mouse as unknown as MouseHandlers;

    // Matter's default listeners call preventDefault on wheel and touch events,
    // which blocks page scrolling over the footer. Remove them and only capture
    // touches that actually start on a shape.
    scene.removeEventListener("wheel", handlers.mousewheel);
    scene.removeEventListener("touchstart", handlers.mousedown);
    scene.removeEventListener("touchmove", handlers.mousemove);
    scene.removeEventListener("touchend", handlers.mouseup);

    let touchDragging = false;
    const onTouchStart = (e: TouchEvent) => {
      const t = e.touches[0];
      const rect = scene.getBoundingClientRect();
      const hit = Matter.Query.point(shapes, { x: t.clientX - rect.left, y: t.clientY - rect.top }).length > 0;
      if (!hit) return;
      touchDragging = true;
      handlers.mousedown(e);
    };
    const onTouchMove = (e: TouchEvent) => {
      if (touchDragging) handlers.mousemove(e);
    };
    const onTouchEnd = (e: TouchEvent) => {
      if (!touchDragging) return;
      touchDragging = false;
      handlers.mouseup(e);
    };
    // Release the grabbed body even if the button is let go outside the footer
    const onWindowMouseUp = (e: MouseEvent) => {
      if (e.target !== scene) handlers.mouseup(e);
    };

    scene.addEventListener("touchstart", onTouchStart, { passive: false });
    scene.addEventListener("touchmove", onTouchMove, { passive: false });
    scene.addEventListener("touchend", onTouchEnd, { passive: false });
    window.addEventListener("mouseup", onWindowMouseUp);

    const mouseConstraint = Matter.MouseConstraint.create(engine, {
      mouse: mouse,
      constraint: { stiffness: 0.2, render: { visible: false } },
    });

    Matter.World.add(world, mouseConstraint);

    // Sync DOM elements with Matter.js bodies
    const sync = () => {
      shapes.forEach((body, index) => {
        const el = elementsRef.current[index];
        if (el) {
          const { x, y } = body.position;
          el.style.transform = `translate(${x - shapeMetadata[index].w / 2}px, ${y - shapeMetadata[index].h / 2}px) rotate(${body.angle}rad)`;
        }
      });
    };
    Matter.Events.on(engine, "afterUpdate", sync);

    // Only simulate while the footer is on screen, so the drop is actually seen
    // and the loop doesn't burn CPU for the rest of the page.
    const runner = Matter.Runner.create();
    let running = false;
    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !running) {
          Matter.Runner.run(runner, engine);
          running = true;
        } else if (!entry.isIntersecting && running) {
          Matter.Runner.stop(runner);
          running = false;
        }
      },
      { threshold: 0.2 }
    );
    intersectionObserver.observe(scene);

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        if (newWidth === 0 || newHeight === 0) continue;

        Matter.Body.setPosition(floor, { x: newWidth / 2, y: newHeight + WALL / 2 });
        Matter.Body.setPosition(leftWall, { x: -WALL / 2, y: newHeight / 2 });
        Matter.Body.setPosition(rightWall, { x: newWidth + WALL / 2, y: newHeight / 2 });

        // Pull back any bodies left outside the new bounds
        shapes.forEach((body, index) => {
          const { w, h } = shapeMetadata[index];
          const x = Math.min(Math.max(body.position.x, w / 2), Math.max(w / 2, newWidth - w / 2));
          const y = Math.min(body.position.y, newHeight - h / 2);
          if (x !== body.position.x || y !== body.position.y) {
            Matter.Body.setPosition(body, { x, y });
            Matter.Body.setVelocity(body, { x: 0, y: 0 });
          }
        });
        sync();
      }
    });

    resizeObserver.observe(scene);

    return () => {
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      scene.removeEventListener("touchstart", onTouchStart);
      scene.removeEventListener("touchmove", onTouchMove);
      scene.removeEventListener("touchend", onTouchEnd);
      scene.removeEventListener("mousemove", handlers.mousemove);
      scene.removeEventListener("mousedown", handlers.mousedown);
      scene.removeEventListener("mouseup", handlers.mouseup);
      window.removeEventListener("mouseup", onWindowMouseUp);
      Matter.Events.off(engine, "afterUpdate", sync);
      Matter.Runner.stop(runner);
      Matter.World.clear(world, false);
      Matter.Engine.clear(engine);
    };
  }, []);

  return (
    <footer className={`relative w-full bg-background border-t border-foreground/10 text-foreground overflow-hidden ${syne.className}`}>
      
      {/* Physics Canvas for Mouse Interaction */}
      <div 
        ref={sceneRef} 
        className="absolute inset-0 z-0 cursor-grab active:cursor-grabbing"
      />

      {/* Physics DOM Overlays */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        {shapesData.map((shape, i) => (
          <div
            key={shape.id}
            ref={(el) => { elementsRef.current[i] = el; }}
            className="absolute top-0 left-0"
            style={{ width: shape.w, height: shape.h, transform: `translate(${shape.x - shape.w / 2}px, ${shape.y - shape.h / 2}px)` }}
          >
            {shape.type === "head" ? (
              <div className="w-full h-full rounded-full overflow-hidden bg-foreground/5 border-2 border-foreground shadow-lg shadow-black/20">
                <Blobatar name={shape.content} />
              </div>
            ) : (
              <div className="w-full h-full rounded-full bg-foreground text-background flex items-center justify-center font-extrabold text-sm tracking-widest uppercase shadow-lg shadow-black/20">
                {shape.content}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="relative z-10 w-full pointer-events-none">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8 md:pt-24 md:pb-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-12 lg:gap-8">
          <div className="lg:col-span-5 flex flex-col gap-6">
            <p className="text-3xl font-extrabold tracking-tight pointer-events-auto w-fit">ONE PERCENT</p>
            <p className="text-foreground/60 max-w-sm leading-relaxed pointer-events-auto">
              A small senior team designing, building and running AI products, automations and web platforms.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-bold text-xl hover:opacity-70 transition-opacity pointer-events-auto w-fit">
              {CONTACT_EMAIL}
            </a>
          </div>

          <nav aria-label="Footer" className="lg:col-span-4 grid grid-cols-2 gap-8">
            <div className="flex flex-col gap-4">
              <p className="font-bold text-lg mb-2 pointer-events-auto w-fit">Pages</p>
              {navLinks.map((l) => (
                <Link key={l.href} href={l.href} className={footerLink}>
                  {l.label}
                </Link>
              ))}
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-bold text-lg mb-2 pointer-events-auto w-fit">Start a project</p>
              <a href={BOOK_CALL_URL} className={footerLink}>Book a call</a>
              <EstimateButton className={`${footerLink} text-left`} />
            </div>
          </nav>

          <div className="lg:col-span-3 flex flex-col gap-6 lg:items-end">
            <p className="font-bold text-lg hidden lg:block mb-2 pointer-events-auto">Connect</p>
            <div className="flex gap-4 pointer-events-auto">
              {/* Twitter */}
              <a href="#" aria-label="X (Twitter)" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                </svg>
              </a>
              {/* LinkedIn */}
              <a href="#" aria-label="LinkedIn" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Instagram */}
              <a href="#" aria-label="Instagram" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 4.043-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-4.043-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 3.807v.468c0 2.456.011 2.784.058 3.807.045.975.207 1.504.344 1.857.182.466.399.8.748 1.15.35.35.683.566 1.15.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466-.182.8-.398 1.15-.748.35-.35.566-.683.748-1.15.137-.353.3-.882.344-1.857.048-1.055.058-1.37.058-4.041v-.08c0-2.597-.01-2.917-.058-3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
                </svg>
              </a>
              {/* Github */}
              <a href="#" aria-label="GitHub" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-foreground hover:text-background transition-colors">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        <div className="w-full border-t border-foreground/10">
          <div className="max-w-7xl mx-auto px-6 py-6 text-sm text-foreground/40 font-medium">
            <p className="pointer-events-auto w-fit">© {new Date().getFullYear()} One Percent. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
