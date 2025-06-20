import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "$/components/ui/select";
import { createSignal } from "solid-js";

const themes = ["light", "dark", "rosey", "system"];
const themeLabels = {
	light: "Light",
	dark: "Dark",
	rosey: "Rosey",
	system: "System",
};

type Icon = {
	[key: `icon${string}`]: Element;
};

type Theme = keyof typeof themeLabels;

const ThemeSwitcher = (props: { icons: Icon }) => {
	return (
		<>
			<Select
				options={themes}
				itemComponent={(props_) => (
					<SelectItem item={props_.item} class="p-4 md:p-2">
						{
							<span class="flex items-center gap-2">
								{
									props.icons[
										`icon${
											themeLabels[
												props_.item.rawValue as Theme
											]
										}`
									]
								}
								{
									themeLabels[
										props_.item
											.rawValue as keyof typeof themeLabels
									]
								}
							</span>
						}
					</SelectItem>
				)}
				defaultValue={"system"}
				placeholder="Select a theme"
				onChange={(value) => {
					if (value === "system") {
						document.documentElement.dataset.theme = "";
						fetch("/theme", {
							method: "POST",
							body: JSON.stringify({ theme: "system" }),
						});
					} else {
						document.documentElement.dataset.theme =
							value as string;
						fetch("/theme", {
							method: "POST",
							body: JSON.stringify({ theme: value }),
						});
					}
				}}
				class="flex-shrink-1"
			>
				<SelectTrigger>
					<SelectValue<Theme> class="flex items-center gap-2">
						{(state) => {
							return (
								<>
									{
										props.icons[
											`icon${
												themeLabels[
													state.selectedOption()
												]
											}`
										]
									}
									{themeLabels[state.selectedOption()]}
								</>
							);
						}}
					</SelectValue>
				</SelectTrigger>
				<SelectContent />
			</Select>
		</>
	);
};

export default ThemeSwitcher;
