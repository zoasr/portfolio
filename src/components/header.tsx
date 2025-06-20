import { createSignal, For } from "solid-js";
import ThemeSwitcher from "./theme-switcher";

export default function HeaderTSX({
	zap,
	close,
	open,
	iconLight,
	iconDark,
	navItems,
}: any) {
	const [isOpen, setIsOpen] = createSignal(false);
	const [active, setActive] = createSignal(window.location.pathname);

	const icons = {
		iconLight,
		iconDark,
	};

	return (
		<header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/60">
			<div class="container mx-auto flex h-16 max-w-screen-2xl items-center justify-between px-4">
				<a href="/" class="flex items-center gap-2 group text-primary">
					{zap}
					<span class="font-bold text-xl tracking-tight">zoasr</span>
				</a>

				<nav class="hidden md:flex items-center gap-6 text-sm">
					<For each={navItems} fallback={<div>Loading...</div>}>
						{(item) => (
							<a
								href={item.href}
								classList={{
									"text-muted-foreground transition-colors hover:text-primary hover:font-medium":
										true,
									"text-primary": active() === item.href,
								}}
								onClick={() => setActive(item.href)}
							>
								{item.label}
							</a>
						)}
					</For>
				</nav>
				<span class="md:inline hidden ">
					<ThemeSwitcher icons={icons} />
				</span>

				<div class="md:hidden">
					<button
						onClick={() => setIsOpen(!isOpen())}
						class="text-muted-foreground p-2"
					>
						{isOpen() ? <>{close}</> : <>{open}</>}
					</button>
				</div>
			</div>
			<div
				class="md:hidden max-h-fit backdrop-blur-2xl border-t border-border/40 transition-all duration-200 "
				classList={{
					"h-0 opacity-0 pointer-events-none": !isOpen(),
					"h-[350px] opacity-100 pointer-events-auto": isOpen(),
				}}
			>
				<nav class="flex flex-col items-stretch gap-1 p-4">
					<For each={navItems} fallback={<div>Loading...</div>}>
						{(item) => (
							<a
								href={item.href}
								onClick={() => {
									setIsOpen(false);
									setActive(item.href);
								}}
								classList={{
									"text-muted-foreground transition-colors hover:text-primary hover:bg-background w-full text-center py-3 rounded-md text-base":
										true,
									"text-primary": active() === item.href,
								}}
							>
								{item.label}
							</a>
						)}
					</For>
					<span class="text-muted-foreground transition-colors hover:text-primary hover:bg-background w-full text-center py-3 rounded-md text-base">
						<ThemeSwitcher icons={icons} />
					</span>
				</nav>
			</div>
		</header>
	);
}
