import { For } from "solid-js";
import { createStore } from "solid-js/store";
import { Icon } from "@iconify-icon/solid";
import ThemeSwitcher from "./theme-switcher";
import type { Theme } from "./Header.astro";

export const [menuStore, setMenuStore] = createStore({
	isOpen: false,
});

export const toggleMenu = () => {
	setMenuStore((state) => ({
		isOpen: !state.isOpen,
	}));
};

export const MenuToggle = () => {
	return (
		<div class="md:hidden">
			<button class="text-muted-foreground p-2" onClick={toggleMenu}>
				{menuStore.isOpen ? (
					<Icon icon="pixelarticons:close" />
				) : (
					<Icon icon="pixelarticons:menu" />
				)}
			</button>
		</div>
	);
};

export const MobileMenu = (props: {
	navItems: { href: string; label: string }[];
	theme: Theme;
}) => {
	return (
		<div
			class="md:hidden max-h-fit backdrop-blur-2xl border-t border-border/40 transition-all duration-200"
			classList={{
				"h-0 opacity-0 pointer-events-none": !menuStore.isOpen,
				"h-[350px] opacity-100 pointer-events-auto": menuStore.isOpen,
			}}
		>
			<nav class="flex flex-col items-stretch gap-1 p-4">
				<For each={props.navItems} fallback={<div>Loading...</div>}>
					{(item) => (
						<a
							href={item.href}
							onClick={() => {
								toggleMenu();
							}}
							class="text-muted-foreground transition-colors hover:text-primary hover:bg-background w-full text-center py-3 rounded-md text-base data-[active=true]:text-primary"
							data-active={"false"}
							data-sectionid={item.href.split("#")[1]}
						>
							{item.label}
						</a>
					)}
				</For>
				<span class="text-muted-foreground transition-colors hover:text-primary hover:bg-background w-full text-center py-3 rounded-md text-base">
					<ThemeSwitcher theme={props.theme as Theme} />
				</span>
			</nav>
		</div>
	);
};
