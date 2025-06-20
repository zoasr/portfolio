import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "$/components/ui/select";

import { Icon } from "@iconify-icon/solid";

const themes = ["light", "dark", "rosey", "system"];
const themeLabels = {
	light: "Light",
	dark: "Dark",
	rosey: "Rosey",
	system: "System",
};

const IconComponent = (props: { name: string }) => {
	return <Icon icon={props.name} />;
};

const icons = {
	light: "pixelarticons:sun-alt",
	dark: "pixelarticons:moon",
	rosey: "pixelarticons:moon",
	system: "pixelarticons:device-laptop",
};

type Theme = keyof typeof themeLabels;

const ThemeSwitcher = (props: { theme: Theme }) => {
	return (
		<>
			<Select
				options={themes}
				itemComponent={(props_) => (
					<SelectItem item={props_.item} class="p-4 md:p-2">
						{
							<span class="flex items-center gap-2">
								<IconComponent
									name={icons[props_.item.rawValue as Theme]}
								/>
								{themeLabels[props_.item.rawValue as Theme]}
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
									<IconComponent
										name={
											icons[
												state.selectedOption() as Theme
											]
										}
									/>
									{
										themeLabels[
											state.selectedOption() as Theme
										]
									}
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
